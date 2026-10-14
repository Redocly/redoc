import React, { Fragment } from 'react';
import markdoc from '@markdoc/markdoc';
import { styled } from 'styled-components';

import type { Node, Tag } from '@markdoc/markdoc';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import type { MarkdownRenderer } from '../../contexts/markdownAdapter.js';
import type { MarkdocOptions } from '../../types/options.js';

const MarkdownWrapperStyled = styled(MarkdownWrapper)`
  margin: 0;
`;

/**
 * The default Markdoc-based {@link MarkdownRenderer}, supplied by the standalone build. Revives the
 * stored AST, transforms it with `markdocOptions` (tags/nodes/components/variables), and renders each
 * top-level node through Markdoc's React renderer, wrapped in the theme's markdown styles.
 */
export function createMarkdocRenderer(markdocOptions?: MarkdocOptions): MarkdownRenderer {
  const config = markdocOptions && {
    tags: markdocOptions.tags,
    nodes: markdocOptions.nodes,
    partials: markdocOptions.partials,
    variables: markdocOptions.variables,
    functions: markdocOptions.functions,
  };
  const components = markdocOptions ? { components: markdocOptions.components ?? {} } : undefined;

  return (source) => {
    if (typeof source === 'string') {
      return <>{source}</>;
    }
    const ast = markdoc.Ast.fromJSON(JSON.stringify(source)) as Node | Node[];
    // Narrow the union so each call binds a concrete `transform` overload (Node vs Node[]).
    const transformed = Array.isArray(ast)
      ? markdoc.transform(ast, config)
      : markdoc.transform(ast, config);
    const content = Array.isArray(transformed) ? transformed : (transformed as Tag).children;
    return (
      <>
        {content.map((item, index) => (
          <Fragment key={(item as Tag)?.attributes?.id || index}>
            <MarkdownWrapperStyled
              children={markdoc.renderers.react(item, React, components)}
              as="div"
            />
          </Fragment>
        ))}
      </>
    );
  };
}
