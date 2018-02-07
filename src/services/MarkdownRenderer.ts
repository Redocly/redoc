import * as Remarkable from 'remarkable';

import slugify from 'slugify';
import { MDComponent } from '../components/Markdown/Markdown';
import { highlight, html2Str } from '../utils';
import { SECTION_ATTR } from './MenuStore';

const md = new Remarkable('default', {
  html: true,
  linkify: true,
  breaks: false,
  typographer: false,
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

  private _origRules: any = {};

  saveOrigRules() {
    this._origRules.open = md.renderer.rules.heading_open;
    this._origRules.close = md.renderer.rules.heading_close;
  }

  restoreOrigRules() {
    md.renderer.rules.heading_open = this._origRules.open;
    md.renderer.rules.heading_close = this._origRules.close;
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

  headingOpenRule = (tokens, idx) => {
    if (tokens[idx].hLevel > 2) {
      return this._origRules.open(tokens, idx);
    } else {
      const content = tokens[idx + 1].content;
      if (tokens[idx].hLevel === 1) {
        this.currentTopHeading = this.saveHeading(content);
        const id = this.currentTopHeading.id;
        return (
          `<a name="${id}"></a>` +
          `<h${tokens[idx].hLevel} ${SECTION_ATTR}="${id}" id="${id}">` +
          `<a class="share-link" href="#${id}"></a>`
        );
      } else if (tokens[idx].hLevel === 2) {
        const { id } = this.saveHeading(
          content,
          this.currentTopHeading && this.currentTopHeading.items,
        );
        return (
          `<a name="${id}"></a>` +
          `<h${tokens[idx].hLevel} ${SECTION_ATTR}="${id}" id="${id}">` +
          `<a class="share-link" href="#${id}"></a>`
        );
      }
    }
  };

  headingCloseRule = (tokens, idx) => {
    if (tokens[idx].hLevel > 2) {
      return this._origRules.close(tokens, idx);
    } else {
      return `</h${tokens[idx].hLevel}>\n`;
    }
  };

  renderMd(rawText: string, raw: boolean = true): string {
    if (!raw) {
      this.saveOrigRules();
      md.renderer.rules.heading_open = this.headingOpenRule;
      md.renderer.rules.heading_close = this.headingCloseRule;
    }

    const res = md.render(rawText.toString());

    if (!raw) {
      this.restoreOrigRules();
    }
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
