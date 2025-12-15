import markdoc from '@markdoc/markdoc';
import { outdent } from 'outdent';
import React from 'react';

import { html } from '@redocly/theme/markdoc/tags/html';

import { processHtmlTokens } from '../processHtmlTokens.js';

const tokenizer = new markdoc.Tokenizer({
  html: true,
  allowIndentation: true,
  allowComments: true,
});

function testRenderMarkdoc(content: string) {
  const tokens = tokenizer.tokenize(content);
  const processedTokens = processHtmlTokens(tokens);
  const config: any = { tags: { html: html.schema } };
  const ast = markdoc.parse(processedTokens, config);

  const errors = markdoc.validate(ast, config);

  return {
    jsx: markdoc.renderers.react(markdoc.transform(ast, config), React, { components: {} }),
    errors,
  };
}

describe('processHtmlTokens', () => {
  test('should process block and inline html tokens', () => {
    const { jsx, errors } = testRenderMarkdoc(outdent`
      # Heading

      <div id="22">

      Inline <strong>bold</strong> text

      </div>
    `);
    expect(errors).toEqual([]);
    expect(jsx).toMatchSnapshot();
  });

  test('should process inline html tokens', () => {
    const { jsx, errors } = testRenderMarkdoc(outdent`
      Inline <strong>bold</strong> text

      # Heading

      Inline <strong>bold</strong> text
    `);

    expect(errors).toEqual([]);
    expect(jsx).toMatchSnapshot();
  });

  test('should report unclosed errors', () => {
    const { jsx, errors } = testRenderMarkdoc(outdent`
      <span> inline

      # Heading

      <strong>

      bold
    `);

    expect(errors).toHaveLength(2);
    expect(jsx).toMatchSnapshot();
  });
});
