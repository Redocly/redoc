export class BrowserDomAdapter {
  static query(selector: string): any { return document.querySelector(selector); }

  static querySelector(el: any /** TODO #9100 */, selector: string): HTMLElement {
    return el.querySelector(selector);
  }

  static onAndCancel(
      el: any /** TODO #9100 */, evt: any /** TODO #9100 */,
      listener: any /** TODO #9100 */): Function {
    el.addEventListener(evt, listener, false);
    // Needed to follow Dart's subscription semantic, until fix of
    // https://code.google.com/p/dart/issues/detail?id=17406
    return () => { el.removeEventListener(evt, listener, false); };
  }

  static attributeMap(element: any /** TODO #9100 */): Map<string, string> {
    var res = new Map<string, string>();
    var elAttrs = element.attributes;
    for (var i = 0; i < elAttrs.length; i++) {
      var attrib = elAttrs[i];
      res.set(attrib.name, attrib.value);
    }
    return res;
  }

  static setStyle(element: any /** TODO #9100 */, styleName: string, styleValue: string) {
    element.style[styleName] = styleValue;
  }

  static removeStyle(element: any /** TODO #9100 */, stylename: string) {
    element.style[stylename] = null;
  }

  static getStyle(element: any /** TODO #9100 */, stylename: string): string {
    return element.style[stylename];
  }

  static hasStyle(element: any /** TODO #9100 */, styleName: string, styleValue: string = null): boolean {
    var value = this.getStyle(element, styleName) || '';
    return styleValue ? value === styleValue : value.length > 0;
  }

  static hasAttribute(element: any /** TODO #9100 */, attribute: string): boolean {
    return element.hasAttribute(attribute);
  }

  static getAttribute(element: any /** TODO #9100 */, attribute: string): string {
    return element.getAttribute(attribute);
  }

  static defaultDoc(): HTMLDocument { return document; }
}
