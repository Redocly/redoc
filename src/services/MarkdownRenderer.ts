import * as Remarkable from 'remarkable';
import { IMenuItem, SECTION_ATTR } from './MenuStore';
import { GroupModel } from './models';
import { highlight } from '../utils';

const md = new Remarkable('default', {
  html: true,
  linkify: true,
  breaks: false,
  typographer: false,
  highlight: (str, lang) => {
    return highlight(str, lang);
  },
});

const COMPONENT_REGEXP = '^\\s*<!-- ReDoc-Inject:\\s+?{component}\\s+?-->\\s*$';

type MarkdownHeading = {
  name: string;
  children?: MarkdownHeading[];
  content?: string;
};

export class MarkdownRenderer {
  public headings: GroupModel[] = [];
  currentTopHeading: GroupModel;

  private _origRules: any = {};

  saveOrigRules() {
    this._origRules.open = md.renderer.rules.heading_open;
    this._origRules.close = md.renderer.rules.heading_close;
  }

  restoreOrigRules() {
    md.renderer.rules.heading_open = this._origRules.open;
    md.renderer.rules.heading_close = this._origRules.close;
  }

  saveHeading(name: string, container: IMenuItem[] = this.headings): GroupModel {
    const item = new GroupModel('section', {
      name,
    });
    item.depth = 1;
    container.push(item);
    return item;
  }

  flattenHeadings(container?: MarkdownHeading[]): MarkdownHeading[] {
    if (container === undefined) return [];
    let res: MarkdownHeading[] = [];
    for (let heading of container) {
      res.push(heading);
      res.push(...this.flattenHeadings(heading.children));
    }
    return res;
  }

  attachHeadingsContent(rawText: string) {
    const buildRegexp = heading => new RegExp(`<h\\d ${SECTION_ATTR}="section/${heading.id}">`);

    const tmpEl = document.createElement('DIV');

    const html2Str = html => {
      tmpEl.innerHTML = html;
      return tmpEl.innerText;
    };

    let flatHeadings = this.flattenHeadings(this.headings);
    if (flatHeadings.length < 1) return;
    let prevHeading = flatHeadings[0];

    let prevPos = rawText.search(buildRegexp(prevHeading));
    for (let i = 1; i < flatHeadings.length; i++) {
      let heading = flatHeadings[i];
      let currentPos = rawText.substr(prevPos + 1).search(buildRegexp(heading)) + prevPos + 1;
      prevHeading.content = html2Str(rawText.substring(prevPos, currentPos));

      prevHeading = heading;
      prevPos = currentPos;
    }
    prevHeading.content = html2Str(rawText.substring(prevPos));
  }

  headingOpenRule = (tokens, idx) => {
    if (tokens[idx].hLevel > 2) {
      return this._origRules.open(tokens, idx);
    } else {
      let content = tokens[idx + 1].content;
      if (tokens[idx].hLevel === 1) {
        this.currentTopHeading = this.saveHeading(content);
        let id = this.currentTopHeading.id;
        return (
          `<a name="${id}"></a>` +
          `<h${tokens[idx].hLevel} ${SECTION_ATTR}="${id}">` +
          `<a class="share-link" href="#${id}"></a>`
        );
      } else if (tokens[idx].hLevel === 2) {
        let { id } = this.saveHeading(content, this.currentTopHeading.items);
        return (
          `<a name="${id}"></a>` +
          `<h${tokens[idx].hLevel} ${SECTION_ATTR}="${id}">` +
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

    let text = rawText;

    let res = md.render(text);

    this.attachHeadingsContent(res);

    if (!raw) {
      this.restoreOrigRules();
    }
    return res;
  }

  extractHeadings(rawText: string): GroupModel[] {
    this.renderMd(rawText, false);
    const res = this.headings;
    this.headings = [];
    return res;
  }

  renderMdWithComponents(
    rawText: string,
    components: { [name: string]: new () => React.Component },
    raw: boolean = true,
  ): (string | { component: new () => React.Component; attrs: any })[] {
    let componentDefs: string[] = [];
    let match;
    let anyCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '(.*?)'), 'gmi');
    while ((match = anyCompRegexp.exec(rawText))) {
      componentDefs.push(match[1]);
    }

    let splitCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '.*?'), 'mi');
    let htmlParts = rawText.split(splitCompRegexp);
    let res: any[] = [];
    for (let i = 0; i < htmlParts.length; i++) {
      const htmlPart = htmlParts[i];
      if (htmlPart) {
        res.push(this.renderMd(htmlPart, raw));
      }
      if (componentDefs[i]) {
        const { componentName, attrs } = parseComponent(componentDefs[i]);
        res.push({
          component: componentName && components[componentName],
          attrs: attrs,
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
  if (match === null || match.length <= 1) return { componentName: undefined, attrs: {} };
  const componentName = match[1];
  return {
    componentName,
    attrs: {}, // TODO
  };
}
