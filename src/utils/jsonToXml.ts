/**
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Mrinmoy Majumdar
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * json2xml
 * @example
 * Schema: {
 *   'prop1' : 'one',
 *   'prop2' : 'two',
 *   'prop3' : [ 'a', 'b', 'c' ],
 *   'prop4' : {
 *     'ob1' : 'val-1',
 *     'ob2' : 'val-2'
 *   }
 * }
 * XML:
 * <root>
 *   <prop1>simple</prop1>
 *   <prop2>
 *     <0>a</0>
 *     <1>b</1>
 *     <2>c</2>
 *   </prop2>
 *   <prop3>
 *     <ob1>val-1</ob1>
 *     <ob2>val-2</ob2>
 *   </prop3>
 * </root>
 **/
export const json2xml = (obj: any, level: number = 1): string => {
  const indent = '  '.repeat(level);
  let xmlText = '';
  if (level === 1 && typeof obj !== 'object') {
    return `\n${indent}${obj.toString()}`;
  }
  for (const prop in obj) {
    const tagNameOrProp = obj[prop]?.['::XML_TAG'] || prop;
    let tagName = '';
    if (Array.isArray(obj[prop])) {
      tagName = tagNameOrProp[0]?.['::XML_TAG'] || `${prop}`;
    } else {
      tagName = tagNameOrProp;
    }
    if (prop.startsWith('::')) {
      continue;
    }
    if (Array.isArray(obj[prop])) {
      xmlText = `${xmlText}\n${indent}<${tagName}>${json2xml(
        obj[prop],
        level + 1,
      )}\n${indent}</${tagName}>`;
    } else if (typeof obj[prop] === 'object') {
      xmlText = `${xmlText}\n${indent}<${tagName}>${json2xml(
        obj[prop],
        level + 1,
      )}\n${indent}</${tagName}>`;
    } else {
      xmlText = `${xmlText}\n${indent}<${tagName}>${obj[prop].toString()}</${tagName}>`;
    }
  }
  return xmlText;
};
