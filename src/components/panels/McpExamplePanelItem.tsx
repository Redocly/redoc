import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { McpExampleNode } from '../../types/content.js';

import { CodeBlock } from '@redocly/theme/components/CodeBlock/CodeBlock';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { CodeBlockPanel, StyledJsonViewer } from './styled.js';

const HEADER_TITLE_FALLBACKS: Record<string, string> = {
  'openapi.mcp.inputExample': 'Input example',
  'openapi.mcp.outputExample': 'Output example',
  'openapi.mcp.argumentsExample': 'Arguments example',
  'openapi.mcp.exampleTitle': 'Resource content',
};

const ContentCodeBlock = styled(CodeBlock)`
  border: none;
  padding: 0 8px;
  margin-bottom: 0;
  --code-block-padding: var(--spacing-xs) 0 var(--spacing-xs) var(--spacing-sm);
`;

export function McpExamplePanelItem({ node }: { node: McpExampleNode }): ReactElement {
  const translate = useSpecTranslate();
  return (
    <>
      {node.children.map((item, index) => (
        <CodeBlockPanel
          key={index}
          className="panel-response-samples"
          header={translate(
            item.headerTitleTranslationKey,
            HEADER_TITLE_FALLBACKS[item.headerTitleTranslationKey],
          )}
          isExpandable={false}
        >
          {item.language ? (
            <ContentCodeBlock
              source={String(item.data)}
              header={{ title: item.language, controls: { copy: {} } }}
            />
          ) : (
            <StyledJsonViewer data={item.data} expandLevel={Number.POSITIVE_INFINITY} />
          )}
        </CodeBlockPanel>
      ))}
    </>
  );
}
