import { styled } from 'styled-components';
import { memo } from 'react';

import type { ReactElement } from 'react';
import type { McpNode } from '../../types/content.js';
import type { PanelNodeProps } from './PanelNodeProps.js';
import type { TFunction } from '../../hooks/useTranslate.js';

import { panelKind } from '../../types/common.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { resolveText } from '../../utils/resolveText.js';
import { ConnectMcpButton } from './ConnectMcpButton.js';
import { OverviewPanel } from './styled.js';

type McpChild = McpNode['children'][number];

export function McpPanelItem({ node }: PanelNodeProps): ReactElement {
  const mcp = node as McpNode;
  const translate = useSpecTranslate();
  const items = mcp.children;

  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);

  return (
    <OverviewPanel header={panelHeader} className="panel-api-docs" isExpandable={false}>
      <PanelContent>
        {items.map((item, index) => (
          <McpPanelRow key={getItemKey(item, index)} item={item} translate={translate} />
        ))}
      </PanelContent>
    </OverviewPanel>
  );
}

function getItemKey(item: McpChild, index: number): string {
  if (item.kind === panelKind.ATTRIBUTE) return `${item.label}-${index}`;
  if (item.kind === panelKind.TAGS) return `${item.title || 'tags'}-${index}`;
  if (item.kind === panelKind.EXTERNAL_LINK) return `${item.url}-${index}`;
  if (item.kind === panelKind.CONNECT_MCP_BUTTON) return `${item.mcpUrl}-${index}`;
  return `mcp-item-${index}`;
}

const McpPanelRow = memo(function McpPanelRow({
  item,
  translate,
}: {
  item: McpChild;
  translate: TFunction;
}): ReactElement | null {
  const translatedTitle = resolveText(translate, item.titleTranslationKey, item.title);
  const translatedLabel =
    'label' in item ? resolveText(translate, item.labelTranslationKey, item.label) : '';
  if (item.kind === panelKind.ATTRIBUTE) {
    return (
      <PanelItem>
        <PanelLabel>{item.title || translatedLabel}</PanelLabel>
        <PanelValue>{item.value}</PanelValue>
      </PanelItem>
    );
  }

  if (item.kind === panelKind.TAGS) {
    return (
      <PanelItem>
        <PanelLabel>{translatedTitle || 'Tags'}</PanelLabel>
        <TagList>
          {item.tags.map((tag) => (
            <Tag key={tag.text} $variant={tag.color === 'green' ? 'success' : undefined}>
              {tag.icon === 'checkmark' && <CheckIcon />} {tag.text}
            </Tag>
          ))}
        </TagList>
      </PanelItem>
    );
  }

  if (item.kind === panelKind.EXTERNAL_LINK) {
    return (
      <PanelItem>
        <PanelLabel>{translatedTitle || 'Link'}</PanelLabel>
        <EndpointUrl href={item.url} target="_blank" rel="noopener noreferrer">
          {item.label}
        </EndpointUrl>
      </PanelItem>
    );
  }

  if (item.kind === panelKind.CONNECT_MCP_BUTTON) {
    return (
      <PageActionsWrapper>
        <ConnectMcpButton actions={item.actions} mcpUrl={item.mcpUrl} />
      </PageActionsWrapper>
    );
  }

  return null;
});

function CheckIcon(): ReactElement {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const PanelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const PanelItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
`;

const PanelLabel = styled.span`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-color-secondary);
  line-height: var(--line-height-sm);
`;

const PanelValue = styled.span`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-family: var(--font-family-monospaced);
  color: var(--text-color-primary);
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
`;

const Tag = styled.span<{ $variant?: 'success' }>`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xxs);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  padding: 0 var(--spacing-xxs);
  border-radius: var(--tag-border-radius);
  font-family: var(--font-family-monospaced);
  background: ${({ $variant }) =>
    $variant === 'success'
      ? 'var(--badge-ok-bg-color, var(--tag-bg-color))'
      : 'var(--tag-bg-color, var(--border-color-secondary))'};
  color: ${({ $variant }) =>
    $variant === 'success'
      ? 'var(--badge-ok-text-color, var(--text-color-secondary))'
      : 'var(--text-color-secondary)'};
`;

const PageActionsWrapper = styled.div`
  & button {
    width: 100%;
  }
  > div {
    padding: 0;
  }
`;

const EndpointUrl = styled.a`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-family: var(--font-family-monospaced);
  color: var(--link-color-primary);
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;
