'use strict';

import {
  Injectable,
  Renderer,
  ComponentRef,
  Type,
  Injector,
  Inject,
  ComponentFactoryResolver
} from '@angular/core';

type NodesOrComponents = HTMLElement | ComponentRef<any>;
export const COMPONENT_PARSER_ALLOWED = 'COMPONENT_PARSER_ALLOWED';

const COMPONENT_REGEXP = '^\\s*<!-- ReDoc-Inject:\\s+?{component}\\s+?-->\\s*$';

@Injectable()
export class ComponentParser {
  private renderer: Renderer;
  private allowedComponents: any;

  static contains(content: string, componentSelector: string) {
    let regexp = new RegExp(COMPONENT_REGEXP.replace('{component}', `<${componentSelector}.*>`), 'mi');
    return regexp.test(content);
  }

  static build(componentSelector) {
    return `<!-- ReDoc-Inject: <${componentSelector}> -->`;
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    @Inject(COMPONENT_PARSER_ALLOWED) allowedComponents
  ) {
    this.allowedComponents = allowedComponents;
  }

  setRenderer(_renderer: Renderer) {
    this.renderer = _renderer;
  }

  splitIntoNodesOrComponents(content: string, injector: Injector):NodesOrComponents[] {
    let componentDefs = [];
    let match;
    let anyCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '(.*?)'), 'gmi');
    while (match = anyCompRegexp.exec(content)) {
      componentDefs.push(match[1]);
    }

    let splitCompRegexp = new RegExp(COMPONENT_REGEXP.replace('{component}', '.*?'), 'mi');
    let htmlParts = content.split(splitCompRegexp);
    let res = [];
    for (let i = 0; i < htmlParts.length; i++) {
      let node = this.renderer.createElement(null, 'div');
      this.renderer.setElementProperty(node, 'innerHTML', htmlParts[i]);
      if (htmlParts[i]) res.push(node);
      if (componentDefs[i]) {
        let componentRef = this.createComponentByHtml(componentDefs[i], injector);
        res.push(componentRef);
      }
    }
    return res;
  }

  createComponentByHtml(htmlTag: string, injector:Injector):ComponentRef<any>| null {
    let { componentType } = this._parseHtml(htmlTag);
    if (!componentType) return null;

    let factory = this.resolver.resolveComponentFactory(componentType);
    return factory.create(injector);
  }

  private _parseHtml(htmlTag: string):{componentType: Type<any> | null, options: any} {
    // TODO: for now only primitive parsing by tagname
    let match = /<([\w_-]+).*?>/.exec(htmlTag);
    if (match.length <= 1) return { componentType: null, options: null };
    let componentName = match[1];

    let componentType = this.allowedComponents[componentName];
    // TODO parse options
    let options = {};
    return {
      componentType,
      options
    };
  }
}
