import * as marked from 'marked';

import { highlight, safeSlugify } from '../utils';
import { AppStore } from './AppStore';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';

const renderer = new marked.Renderer();

marked.setOptions({
  renderer,
  highlight: (str, lang) => {
    return highlight(str, lang);
  },
});

export const LEGACY_REGEXP = '^\\s*<!-- ReDoc-Inject:\\s+?<{component}\\s*?/?>\\s+?-->\\s*$';
export const MDX_COMPONENT_REGEXP = '^\\s*<{component}\\s*?/>\\s*$';
export const COMPONENT_REGEXP = '(?:' + LEGACY_REGEXP + '|' + MDX_COMPONENT_REGEXP + ')';

export interface MDXComponentMeta {
  component: React.ComponentType;
  propsSelector: (store?: AppStore) => any;
  attrs?: object;
}

export interface MarkdownHeading {
  id: string;
  name: string;
  level: number;
  items?: MarkdownHeading[];
  description?: string;
}

export function buildComponentComment(name: string) {
  return `<!-- ReDoc-Inject: <${name}> -->`;
}

export class MarkdownRenderer {
  static containsComponent(rawText: string, componentName: string) {
    const anyCompRegexp = new RegExp(
      COMPONENT_REGEXP.replace(/{component}/g, componentName),
      'gmi',
    );
    return anyCompRegexp.test(rawText);
  }

  headings: MarkdownHeading[] = [];
  currentTopHeading: MarkdownHeading;

  private headingEnhanceRenderer: marked.Renderer;
  private originalHeadingRule: typeof marked.Renderer.prototype.heading;

  constructor(public options?: RedocNormalizedOptions) {
    this.headingEnhanceRenderer = new marked.Renderer();
    this.originalHeadingRule = this.headingEnhanceRenderer.heading.bind(
      this.headingEnhanceRenderer,
    );
    this.headingEnhanceRenderer.heading = this.headingRule;
  }

  saveHeading(
    name: string,
    level: number,
    container: MarkdownHeading[] = this.headings,
    parentId?: string,
  ): MarkdownHeading {
    const item = {
      id: parentId ? `${parentId}/${safeSlugify(name)}` : `section/${safeSlugify(name)}`,
      name,
      level,
      items: [],
    };
    container.push(item);
    return item;
  }

  flattenHeadings(container?: MarkdownHeading[]): MarkdownHeading[] {
    if (container === undefined) {
      return [];
    }
    const res: MarkdownHeading[] = [];
    for (const heading of container) {
      res.push(heading);
      res.push(...this.flattenHeadings(heading.items));
    }
    return res;
  }

  attachHeadingsDescriptions(rawText: string) {
    const buildRegexp = heading => {
      return new RegExp(`##?\\s+${heading.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`);
    };

    const flatHeadings = this.flattenHeadings(this.headings);
    if (flatHeadings.length < 1) {
      return;
    }
    let prevHeading = flatHeadings[0];
    let prevRegexp = buildRegexp(prevHeading);
    let prevPos = rawText.search(prevRegexp);
    for (let i = 1; i < flatHeadings.length; i++) {
      const heading = flatHeadings[i];
      const regexp = buildRegexp(heading);
      const currentPos = rawText.substr(prevPos + 1).search(regexp) + prevPos + 1;
      prevHeading.description = rawText
        .substring(prevPos, currentPos)
        .replace(prevRegexp, '')
        .trim();

      prevHeading = heading;
      prevRegexp = regexp;
      prevPos = currentPos;
    }
    prevHeading.description = rawText
      .substring(prevPos)
      .replace(prevRegexp, '')
      .trim();
  }

  headingRule = (text: string, level: number, raw: string) => {
    if (level === 1) {
      this.currentTopHeading = this.saveHeading(text, level);
    } else if (level === 2) {
      this.saveHeading(
        text,
        level,
        this.currentTopHeading && this.currentTopHeading.items,
        this.currentTopHeading && this.currentTopHeading.id,
      );
    }
    return this.originalHeadingRule(text, level, raw);
  };

  renderMd(rawText: string, extractHeadings: boolean = false): string {
    const opts = extractHeadings ? { renderer: this.headingEnhanceRenderer } : undefined;

    const res = marked(rawText.toString(), opts);

    return res;
  }

  extractHeadings(rawText: string): MarkdownHeading[] {
    this.renderMd(rawText, true);
    this.attachHeadingsDescriptions(rawText);
    const res = this.headings;
    this.headings = [];
    return res;
  }

  // TODO: rewrite this completelly! Regexp-based 👎
  // Use marked ecosystem
  renderMdWithComponents(rawText: string): Array<string | MDXComponentMeta> {
    const components = this.options && this.options.allowedMdComponents;
    if (!components || Object.keys(components).length === 0) {
      return [this.renderMd(rawText)];
    }

    const componentDefs: string[] = [];
    const names = '(?:' + Object.keys(components).join('|') + ')';

    const anyCompRegexp = new RegExp(
      COMPONENT_REGEXP.replace(/{component}/g, '(' + names + '.*?)'),
      'gmi',
    );
    let match = anyCompRegexp.exec(rawText);
    while (match) {
      componentDefs.push(match[1] || match[2]);
      match = anyCompRegexp.exec(rawText);
    }

    const splitCompRegexp = new RegExp(
      COMPONENT_REGEXP.replace(/{component}/g, names + '.*?'),
      'mi',
    );
    const htmlParts = rawText.split(splitCompRegexp);
    const res: any[] = [];
    for (let i = 0; i < htmlParts.length; i++) {
      const htmlPart = htmlParts[i];
      if (htmlPart) {
        res.push(this.renderMd(htmlPart));
      }
      if (componentDefs[i]) {
        const { componentName, attrs } = parseComponent(componentDefs[i]);
        if (!componentName) {
          continue;
        }
        res.push({
          ...components[componentName],
          attrs,
        });
      }
    }
    return res;
  }
}

function parseComponent(
  htmlTag: string,
): {
  componentName?: string;
  attrs: any;
} {
  const match = /([\w_-]+)(\s+[\w_-]+\s*={[^}]*?})*/.exec(htmlTag);
  if (match === null || match.length <= 1) {
    return { componentName: undefined, attrs: {} };
  }
  const componentName = match[1];
  const attrs = {};
  for (let i = 2; i < match.length; i++) {
    if (!match[i]) {
      continue;
    }
    const [name, value] = match[i]
      .trim()
      .split('=')
      .map(p => p.trim());

    // tslint:disable-next-line
    attrs[name] = value.startsWith('{') ? eval(value.substr(1, value.length - 2)) : eval(value);
  }
  return {
    componentName,
    attrs,
  };
}
