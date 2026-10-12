import { Parser } from 'htmlparser2';

import { getJsxConvertedAttributes } from './html-jsx-attribute-mapping.js';

// React's rule: any other name fails the whole render.
const ELEMENT_NAME_RE = /^[a-zA-Z][a-zA-Z:_.\-\d]*$/;

/** A tag whose name is no element name (`GridItem\<T\>` inside an HTML block) stays text as written. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processHtmlTokens(tokens: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openedStack: { name: string; token: any; element: boolean }[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentToken: any = null;
  let written = '';
  const writtenTag = () => written.slice(parser.startIndex, parser.endIndex + 1);

  const parser = new Parser({
    onopentag(name, attrs) {
      const element = ELEMENT_NAME_RE.test(name);
      openedStack.push({ name, token: currentToken, element });
      if (!element) {
        output.push({ type: 'text', content: writtenTag() });
        return;
      }
      output.push({
        type: 'tag_open',
        nesting: 1,
        meta: {
          tag: 'html',
          attributes: [
            { type: 'attribute', name: 'name', value: name },
            { type: 'attribute', name: 'attrs', value: getJsxConvertedAttributes(attrs, name) },
          ],
        },
      });
    },

    ontext(content) {
      if (content?.trim().length > 0) output.push({ type: 'text', content });
    },

    onclosetag(_name, isImplied) {
      // This is always fired after onOpenTag according to the htmlparser2 docs.
      // So no need to check for tags mismatch, as tags will be closed automatically.
      const opened = openedStack.pop();
      if (opened?.element === false) {
        if (!isImplied) output.push({ type: 'text', content: writtenTag() });
        return;
      }
      output.push({
        type: 'tag_close',
        nesting: -1,
        meta: { tag: 'html' },
      });
    },
  });

  for (const token of tokens) {
    if (token.type.startsWith('html')) {
      currentToken = token;
      written += token.content;
      parser.write(token.content);
      continue;
    }

    if (token.type === 'inline') token.children = processHtmlTokens(token.children);

    output.push(token);
  }

  for (const t of openedStack) {
    if (!t.element) continue;
    output.push({
      type: 'error',
      meta: {
        error: {
          message: `HTML tag <${t.name}> is not closed, opened at`,
          location: t?.token?.map
            ? { start: { line: t.token.map[0] }, end: { line: t.token.map[1] } }
            : undefined,
        },
      },
    });

    // auto-close unclosed tag within the inline content or whole document
    output.push({
      type: 'tag_close',
      nesting: -1,
      meta: { tag: 'html' },
    });
  }

  return output;
}
