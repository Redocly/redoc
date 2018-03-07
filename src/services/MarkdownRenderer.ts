import * as marked from 'marked';

import slugify from 'slugify';
import { MDComponent } from '../components/Markdown/Markdown';
import { highlight, html2Str } from '../utils';
import { SECTION_ATTR } from './MenuStore';

const renderer = new marked.Renderer();

marked.setOptions({
  renderer,
  highlight: (str, lang) => {
    return highlight(str, lang);
  },
});

export const COMPONENT_REGEXP = '^\\s*<!-- ReDoc-Inject:\\s+?{component}\\s+?-->\\s*$';
export function buildComponentComment(name: string) {
  return `<!-- ReDoc-Inject: <${name}> -->`;
}

interface MarkdownHeading {
  id: string;
  name: string;
  items?: MarkdownHeading[];
  description?: string;
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

  saveHeading(name: string, container: MarkdownHeading[] = this.headings): MarkdownHeading {
    const item = {
      id: 'section' + '/' + slugify(name),
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
      const { id } = this.saveHeading(text, this.currentTopHeading && this.currentTopHeading.items);
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

  renderMdWithComponents(
    rawText: string,
    components: Dict<MDComponent>,
    raw: boolean = true,
  ): Array<string | MDComponent> {
    const componentDefs: string[] = [];
    const anyCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '(.*?)'), 'gmi');
    let match = anyCompRegexp.exec(rawText);
    while (match) {
      componentDefs.push(match[1]);
      match = anyCompRegexp.exec(rawText);
    }

    const splitCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '.*?'), 'mi');
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
