import { styled } from 'styled-components';

import { Panel } from '@redocly/theme/components/Panel/Panel';
import { Tag } from '@redocly/theme/components/Tag/Tag';

export function omitBindingVersion(value: Record<string, unknown>): Record<string, unknown> {
  const { bindingVersion: _, ...rest } = value;
  return rest;
}

export const BindingPanel = styled(Panel)`
  [data-component-name='Panel/PanelBody'] {
    background-color: var(--layer-color-ontonal);
    padding: 0;

    > *:not(:last-child) {
      border-bottom: var(--panel-border-local);
    }

    & div {
      border-bottom: none;
    }
  }
`;

export const JsonBindingPanel = styled(BindingPanel)`
  [data-component-name='Panel/PanelBody'] {
    & div {
      padding: 0;
    }

    .code-block-header {
      padding-right: var(--spacing-sm);
    }
  }
`;

export const Row = styled.div`
  min-height: 40px;
  padding: var(--spacing-xs) var(--spacing-md);
  align-items: center;
  display: flex;
  width: 100%;
  gap: var(--spacing-md);

  & > *:first-child {
    flex: 1;
  }

  & > *:nth-child(2) {
    flex: 2;
  }
`;

export const Label = styled.span`
  color: var(--text-color-description);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

export const ValueCell = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const BindingTag = styled(Tag)`
  text-transform: none;
`;

export const SchemaWrapper = styled.div`
  padding: var(--spacing-xs) var(--spacing-md);
`;

export const JsonViewerWrapper = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
`;
