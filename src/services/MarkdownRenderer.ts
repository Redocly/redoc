import * as marked from 'marked';

import { highlight, html2Str, safeSlugify } from '../utils';
import { AppStore } from './AppStore';
import { SECTION_ATTR } from './MenuStore';

const renderer = new marked.Renderer();

marked.setOptions({
  renderer,
  highlight: (str, lang) => {
    return highlight(str, lang);
  },
});

export const LEGACY_REGEXP = '^\\s*<!-- ReDoc-Inject:\\s+?{component}\\s+?-->\\s*$';
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
  items?: MarkdownHeading[];
  description?: string;
}

export function buildComponentComment(name: string) {
  return `<!-- ReDoc-Inject: <${name}> -->`;
}

export class MarkdownRenderer {
  headings: MarkdownHeading[] = [];
  currentTopHeading: MarkdownHeading;

  private headingEnhanceRenderer: marked.Renderer;
  private originalHeadingRule: typeof marked.Renderer.prototype.heading;

  constructor() {
    this.headingEnhanceRenderer = new marked.Renderer();
    this.originalHeadingRule = this.headingEnhanceRenderer.heading.bind(
      this.headingEnhanceRenderer,
    );
    this.headingEnhanceRenderer.heading = this.headingRule;
  }

  saveHeading(
    name: string,
    container: MarkdownHeading[] = this.headings,
    parentId?: string,
  ): MarkdownHeading {
    const item = {
      id: parentId ? `${parentId}/${safeSlugify(name)}` : `section/${safeSlugify(name)}`,
      name,
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
    const buildRegexp = heading =>
      new RegExp(`<h\\d ${SECTION_ATTR}="${heading.id}" id="${heading.id}">`);

    const flatHeadings = this.flattenHeadings(this.headings);
    if (flatHeadings.length < 1) {
      return;
    }
    let prevHeading = flatHeadings[0];

    let prevPos = rawText.search(buildRegexp(prevHeading));
    for (let i = 1; i < flatHeadings.length; i++) {
      const heading = flatHeadings[i];
      const currentPos = rawText.substr(prevPos + 1).search(buildRegexp(heading)) + prevPos + 1;
      prevHeading.description = html2Str(rawText.substring(prevPos, currentPos));

      prevHeading = heading;
      prevPos = currentPos;
    }
    prevHeading.description = html2Str(rawText.substring(prevPos));
  }

  headingRule = (text: string, level: number, raw: string) => {
    if (level === 1) {
      this.currentTopHeading = this.saveHeading(text);
      const id = this.currentTopHeading.id;
      return (
        `<a name="${id}"></a>` +
        `<h${level} ${SECTION_ATTR}="${id}" id="${id}">` +
        `<a class="share-link" href="#${id}"></a>${text}</h${level}>`
      );
    } else if (level === 2) {
      const { id } = this.saveHeading(
        text,
        this.currentTopHeading && this.currentTopHeading.items,
        this.currentTopHeading && this.currentTopHeading.id,
      );
      return (
        `<a name="${id}"></a>` +
        `<h${level} ${SECTION_ATTR}="${id}" id="${id}">` +
        `<a class="share-link" href="#${id}"></a>${text}</h${level}>`
      );
    } else {
      return this.originalHeadingRule(text, level, raw);
    }
  };

  renderMd(rawText: string, raw: boolean = true): string {
    const opts = raw ? undefined : { renderer: this.headingEnhanceRenderer };

    const res = marked(rawText.toString(), opts);

    return res;
  }

  extractHeadings(rawText: string): MarkdownHeading[] {
    const text = this.renderMd(rawText, false);
    this.attachHeadingsDescriptions(text);
    const res = this.headings;
    this.headings = [];
    return res;
  }

  // TODO: rewrite this completelly! Regexp-based 👎
  // Use marked ecosystem
  renderMdWithComponents(
    rawText: string,
    components: Dict<MDXComponentMeta>,
    raw: boolean = true,
  ): Array<string | MDXComponentMeta> {
    const componentDefs: string[] = [];
    const names = '(?:' + Object.keys(components).join('|') + ')';

    const anyCompRegexp = new RegExp(
      COMPONENT_REGEXP.replace(/{component}/g, '(<?' + names + '.*?)'),
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
        res.push(this.renderMd(htmlPart, raw));
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
  if (htmlTag.startsWith('<')) {
    return legacyParse(htmlTag);
  }

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

function legacyParse(
  htmlTag: string,
): {
  componentName?: string;
  attrs: any;
} {
  const match = /<([\w_-]+).*?>/.exec(htmlTag);
  if (match === null || match.length <= 1) {
    return { componentName: undefined, attrs: {} };
  }
  const componentName = match[1];
  return {
    componentName,
    attrs: {}, // TODO
  };
}
