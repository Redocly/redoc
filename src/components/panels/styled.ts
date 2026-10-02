import { styled } from 'styled-components';

import { Panel } from '@redocly/theme/components/Panel/Panel';
import { CodeBlock } from '@redocly/theme/components/CodeBlock/CodeBlock';
import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';

export const CodeBlockPanel = styled(Panel)`
  [data-component-name='Panel/PanelBody'] {
    padding: var(--spacing-sm) 0 0;
  }
`;

export const OverviewPanel = styled(Panel)`
  [data-component-name='Panel/PanelHeader'],
  [data-component-name='Panel/PanelBody'] {
    padding: var(--spacing-sm) var(--spacing-md);
  }
`;

export const StyledCodeBlock = styled(CodeBlock)`
  border: none;
  margin: 0;
  --code-block-padding: var(--spacing-xs) 0 var(--spacing-xs) 20px;

  .code-block-header {
    border-bottom: 0;
    padding-right: var(--spacing-sm);
    margin-top: 0;
  }
`;

export const StyledJsonViewer = styled(JsonViewer)`
  --code-block-padding: var(--spacing-xs) 0 var(--spacing-xs) 20px;
`;

export const SectionHeader = styled.div`
  font-weight: var(--panel-heading-font-weight-local);
  line-height: var(--line-height-base);
  color: var(--panel-heading-text-color);
`;

export const VariablesContainer = styled.div`
  border-top: 1px solid var(--border-color-secondary);
`;
