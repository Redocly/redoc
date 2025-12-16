import React, { Fragment } from 'react';
import markdoc from '@markdoc/markdoc';
import { useAtomValue } from 'jotai';
import DOMPurify from 'dompurify';

import type { ReactElement } from 'react';
import type { RenderableTreeNode, Tag } from '@markdoc/markdoc';
import type { MarkdownProps } from './types.js';

import { isString } from '@redocly/theme/core/openapi';
import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import { globalOptionsAtom } from '../../jotai/store.js';
import { processHtmlTokens } from './html/processHtmlTokens.js';

const TAGS_NOT_TO_WRAP = ['OpenApiResponse', 'OpenApiRequestBody'];
const tokenizer = new markdoc.Tokenizer({
  html: true,
  allowIndentation: true,
  allowComments: true,
});
(tokenizer as any).parser.block.ruler.getRules('reference').length = 0;

export const Markdown = ({
  source,
  ast,
  htmlWrap,
  ...props
}: MarkdownProps): ReactElement | null => {
  const options = useAtomValue(globalOptionsAtom);

  if (!source && !ast) {
    return null;
  }

  const config = options?.markdocOptions && {
    tags: options.markdocOptions?.tags,
    nodes: options.markdocOptions?.nodes,
    partials: options.markdocOptions?.partials,
    variables: options.markdocOptions?.variables,
    functions: options.markdocOptions?.functions,
  };
  const components = options?.markdocOptions && {
    components: options.markdocOptions?.components,
  };

  let nodes: RenderableTreeNode[] | RenderableTreeNode | undefined;

  if (source) {
    if (isString(source)) {
      const sanitizeSource = options?.sanitize ? DOMPurify.sanitize(source) : source;
      const tokens = tokenizer.tokenize(sanitizeSource);
      const htmlSource = processHtmlTokens(tokens);

      const ast = markdoc.parse(htmlSource, { slots: true });
      nodes = markdoc.transform(ast, config);
    } else {
      const ast = markdoc.Ast.fromJSON(
        typeof source.result === 'object' ? JSON.stringify(source.result) : source.result,
      );
      if (Array.isArray(ast)) {
        nodes = markdoc.transform(ast, config);
      } else {
        nodes = markdoc.transform(ast, config);
      }
    }
  } else if (ast) {
    nodes = markdoc.transform(ast, config);
  }

  const htmlRender = (content) => {
    const html = markdoc.renderers.react(content, React, components);

    return <MarkdownWrapper {...props} children={html} as="div" />;
  };

  if (!htmlWrap) {
    return htmlRender(nodes);
  }

  const shouldWrap = (node: RenderableTreeNode) =>
    (node as Tag).attributes?.htmlWrap !== false && !TAGS_NOT_TO_WRAP.includes((node as Tag)?.name);
  const render = (wrap, content) => (wrap ? htmlWrap(htmlRender(content)) : htmlRender(content));

  nodes = Array.isArray(nodes) ? nodes : (nodes as Tag).children;

  return (
    <>
      {nodes.map((item, index) => (
        <Fragment key={(item as Tag)?.attributes?.id || index}>
          {render(shouldWrap(item), item)}
        </Fragment>
      ))}
    </>
  );
};
