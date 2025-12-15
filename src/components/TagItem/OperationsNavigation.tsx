import { useMemo, memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutVariant } from '@redocly/config';
import { useAtomValue } from 'jotai/index';

import type { GroupModel, OperationMenuItem } from '../../models/index.js';
import type { OperationsNavigationProps } from './types.js';

import { SamplesPanel } from '../common/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { OperationNavigationItems } from './OperationNavigationItems.js';
import { StyledButton } from './styled.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';
import { isRenderableMenuItem } from '../../utils/menu.js';

const MAX_OPERATIONS = 8;

export function OperationsNavigationComponent({
  items,
  routingBasePath,
}: OperationsNavigationProps) {
  const translate = useTranslate();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const layout = useAtomValue(layoutAtom);
  const isStacked = layout === LayoutVariant.STACKED;

  const {
    operations,
    webhooks,
    schemas,
    mcpTools,
    showMoreCount,
    totalCount,
    mcpResources,
    mcpPrompts,
  } = useMemo(() => {
    const all = items.filter((item) => isRenderableMenuItem(item));
    const list = isExpanded ? all : all.slice(0, MAX_OPERATIONS);
    const {
      operations,
      additionalOperations,
      webhooks,
      schemas,
      mcpTools,
      mcpResources,
      mcpPrompts,
    } = list.reduce(
      (acc, item) => {
        if (item.type === 'operation' && (item as OperationMenuItem).isWebhook) {
          acc.webhooks.push(item as OperationMenuItem);
        } else if (item.type === 'operation') {
          const operationItem = item as OperationMenuItem;
          if (operationItem.isAdditionalOperation) {
            acc.additionalOperations.push(operationItem);
          } else {
            acc.operations.push(operationItem);
          }
        } else if (item.type === 'schema') {
          acc.schemas.push(item);
        } else if (item.type === 'tool') {
          acc.mcpTools.push(item);
        } else if (item.type === 'rsrc') {
          acc.mcpResources.push(item);
        } else if (item.type === 'prompt') {
          acc.mcpPrompts.push(item);
        }
        return acc;
      },
      {
        operations: [] as OperationMenuItem[],
        additionalOperations: [] as OperationMenuItem[],
        webhooks: [] as OperationMenuItem[],
        schemas: [] as GroupModel[],
        mcpTools: [] as GroupModel[],
        mcpResources: [] as GroupModel[],
        mcpPrompts: [] as GroupModel[],
      },
    );
    return {
      operations: [...operations, ...additionalOperations],
      schemas,
      mcpTools,
      webhooks,
      mcpResources,
      mcpPrompts,
      showMoreCount: !isExpanded && all.length > MAX_OPERATIONS ? all.length - MAX_OPERATIONS : 0,
      totalCount: all.length,
    };
  }, [isExpanded, items]);

  const handleOnClick = useCallback((link: string) => navigate(link), [navigate]);

  if (!totalCount) {
    return null;
  }

  return (
    <Wrapper isStacked={isStacked} data-testid="operation-navigation-list">
      {schemas.length > 0 && (
        <OperationNavigationItems
          items={schemas}
          onClick={handleOnClick}
          routingBasePath={routingBasePath}
          translate={translate}
          title={translate('openapi.schemas', 'Schemas')}
        />
      )}
      {mcpTools.length > 0 && (
        <OperationNavigationItems
          items={mcpTools}
          onClick={handleOnClick}
          routingBasePath={routingBasePath}
          translate={translate}
          title={translate('openapi.mcp.tools', 'MCP Tools')}
        />
      )}
      {mcpResources.length > 0 && (
        <OperationNavigationItems
          items={mcpResources}
          onClick={handleOnClick}
          routingBasePath={routingBasePath}
          translate={translate}
          title={translate('openapi.mcp.resources', 'MCP Resources')}
        />
      )}
      {mcpPrompts.length > 0 && (
        <OperationNavigationItems
          items={mcpPrompts}
          onClick={handleOnClick}
          routingBasePath={routingBasePath}
          translate={translate}
          title={translate('openapi.mcp.prompts', 'MCP Prompts')}
        />
      )}
      {operations.length > 0 && (
        <OperationNavigationItems
          items={operations}
          onClick={handleOnClick}
          routingBasePath={routingBasePath}
          translate={translate}
          title={translate('openapi.operations', 'Operations')}
        />
      )}
      {webhooks.length > 0 && (
        <OperationNavigationItems
          items={webhooks}
          onClick={handleOnClick}
          routingBasePath={routingBasePath}
          translate={translate}
          title={translate('openapi.webhooks', 'Webhooks')}
        />
      )}
      {!isExpanded && Boolean(showMoreCount) && (
        <StyledButton
          variant="link"
          size="large"
          data-testid="show-more-operations"
          fullWidth={true}
          onClick={() => setIsExpanded(true)}
        >
          {translate('openapi.actions.show', 'Show')} {showMoreCount}{' '}
          {translate('openapi.actions.more', 'more')}...
        </StyledButton>
      )}
    </Wrapper>
  );
}

export const OperationsNavigation = memo<OperationsNavigationProps>(OperationsNavigationComponent);

const Wrapper = styled(SamplesPanel)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  padding-top: var(--spacing-xxl);
`;
