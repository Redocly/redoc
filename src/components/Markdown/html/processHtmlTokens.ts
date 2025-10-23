import { Parser } from 'htmlparser2';

import { getJsxConvertedAttributes } from './htmlJsxAttribute.js';

export function processHtmlTokens(tokens: any) {
  const output: any = [];
  const openedStack: { name: string; token: any }[] = [];
  let currentToken: any = null;

  const parser = new Parser({
    onopentag(name, attrs) {
      openedStack.push({ name, token: currentToken });
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

    onclosetag() {
      // This is always fired after onOpenTag according to the htmlparser2 docs.
      // So no need to check for tags mismatch, as tags will be closed automatically.
      openedStack.pop();
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
      parser.write(token.content);
      continue;
    }

    if (token.type === 'inline') token.children = processHtmlTokens(token.children);

    output.push(token);
  }

  for (const t of openedStack) {
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
