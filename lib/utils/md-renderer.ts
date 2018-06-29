'use strict';

import { Injectable } from '@angular/core';
import slugify from 'slugify';
import * as Remarkable from 'remarkable';
import { StringMap } from './';

function HTMLescape(html: string): string {
  return (document.createElement('div')
    .appendChild(document.createTextNode(html))
    .parentNode as Element)
    .innerHTML;
}

declare var Prism: any;
const md = new Remarkable({
  html: true,
  linkify: true,
  breaks: false,
  typographer: false,
  highlight: (str, lang) => {
    if (lang === 'json') lang = 'js';
    let grammar = Prism.languages[lang];
    // fallback to click
    if (!grammar) return HTMLescape(str);
    return Prism.highlight(str, grammar);
  }
});

export interface MarkdownHeading {
  title?: string;
  id: string;
  slug?: string;
  content?: string;
  children?: StringMap<MarkdownHeading>;
}

export class MdRenderer {
  public headings: StringMap<MarkdownHeading> = {};
  currentTopHeading: MarkdownHeading;

  private _origRules:any = {};
  private _preProcessors:Function[] = [];

  constructor(private raw: boolean = false) {
  }

  addPreprocessor(p: Function) {
    this._preProcessors.push(p);
  }

  saveOrigRules() {
    this._origRules.open = md.renderer.rules.heading_open;
    this._origRules.close = md.renderer.rules.heading_close;
  }

  restoreOrigRules() {
    md.renderer.rules.heading_open = this._origRules.open;
    md.renderer.rules.heading_close = this._origRules.close;
  }

  saveHeading(title: string, parent:MarkdownHeading = {id:null, children: this.headings}) :MarkdownHeading {
    // if title contains some non-ASCII characters (e.g. chinese) slugify returns empty string
    let slug = slugify(title) || title;
    let id = slug;
    if (parent && parent.id) id = `${parent.id}/${id}`;
    parent.children = parent.children || {};
    parent.children[id] = {
      title,
      id,
      slug
    };
    return parent.children[id];
  }

  flattenHeadings(container: StringMap<MarkdownHeading>): MarkdownHeading[] {
    if (!container) return [];
    let res = [];
    Object.keys(container).forEach(k => {
      let heading = container[k];
      res.push(heading);
      res.push(...this.flattenHeadings(heading.children));
    });
    return res;
  }

  attachHeadingsContent(rawText:string) {
    const buildRegexp = heading => new RegExp(
      `<h\\d section="section/${heading.id}">`
    );

    const tmpEl = document.createElement('DIV');

    const html2Str = html => {
      tmpEl.innerHTML = html;
      return tmpEl.innerText;
    };

    let flatHeadings = this.flattenHeadings(this.headings);
    if (flatHeadings.length < 1) return;
    let prevHeading = flatHeadings[0];

    let prevPos = rawText.search(buildRegexp(prevHeading));
    for (let i=1; i < flatHeadings.length; i++) {
      let heading = flatHeadings[i];
      let currentPos = rawText.substr(prevPos + 1).search(buildRegexp(heading)) + prevPos + 1;
      prevHeading.content = html2Str(rawText.substring(prevPos, currentPos));

      prevHeading = heading;
      prevPos = currentPos;
    }
    prevHeading.content = html2Str(rawText.substring(prevPos));
  }

  headingOpenRule(tokens, idx) {
    if (tokens[idx].hLevel > 2 ) {
      return this._origRules.open(tokens, idx);
    } else {
      let content = tokens[idx + 1].content;
      if (tokens[idx].hLevel === 1 ) {
        this.currentTopHeading = this.saveHeading(content);
        let id = this.currentTopHeading.id;
        return `<h${tokens[idx].hLevel} section="section/${id}">` +
          `<a class="share-link" href="#section/${id}"></a>` +
          `<a name="${id.toLowerCase()}"></a>`;
      } else if (tokens[idx].hLevel === 2 ) {
        let heading = this.saveHeading(content, this.currentTopHeading);
        let contentSlug = `${heading.id}`;
        return `<h${tokens[idx].hLevel} section="section/${heading.id}">` +
          `<a class="share-link" href="#section/${contentSlug}"></a>` +
          `<a name="${heading.slug.toLowerCase()}"></a>`;
      }
    }
  }

  headingCloseRule(tokens, idx) {
    if (tokens[idx].hLevel > 2 ) {
      return this._origRules.close(tokens, idx);
    } else {
      return `</h${tokens[idx].hLevel}>\n`;
    }
  }

  renderMd(rawText:string) {
    if (!this.raw) {
      this.saveOrigRules();
      md.renderer.rules.heading_open = this.headingOpenRule.bind(this);
      md.renderer.rules.heading_close = this.headingCloseRule.bind(this);
    }
    let text = rawText;

    for (let i=0; i<this._preProcessors.length; i++) {
      text = this._preProcessors[i](text);
    }

    let res =  md.render(text);

    this.attachHeadingsContent(res);

    if (!this.raw) {
      this.restoreOrigRules();
    }
    return res;
  }
}
