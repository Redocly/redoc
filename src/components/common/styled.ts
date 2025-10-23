import { Tag } from '@redocly/theme/components/Tag/Tag';

import { styled } from '../../styled-components.js';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: var(--spacing-unit) var(--spacing-md) var(--spacing-sm);
`;

export const HttpVerb = styled(Tag)`
  text-transform: uppercase;
  background-color: unset;
  border: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  align-self: flex-end;
`;

export const MimeLabel = styled.div`
  background-color: var(--panel-samples-dropdown-bg-color);
  color: var(--panel-samples-text-color);
  font-family: inherit;
  margin-bottom: 0;
  height: 36px;
  padding: var(--docs-dropdown-padding);
  font-size: var(--docs-dropdown-font-size);
  border: var(--panel-samples-dropdown-border);
  border-radius: var(--border-radius-md);
`;

export const ArrayLabel = styled.span`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);

  :after {
    content: '';
    flex: auto;
    border-top: 1px solid var(--border-color-primary);
  }
`;

export const LabelValue = styled.span`
  padding: 0 var(--spacing-xs);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color-secondary);
  background-color: var(--bg-color);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--tag-basic-content-color);
`;

export const ArrayClosingLabel = styled(ArrayLabel)`
  margin-top: 0;
  margin-left: auto;

  :after {
    content: none;
  }

  :before {
    content: '';
    flex: auto;
    border-top: 1px solid var(--border-color-primary);
  }
`;
