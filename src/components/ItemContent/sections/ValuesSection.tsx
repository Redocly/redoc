import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import { DeprecatedBadge } from '../../Schema/styled.js';
import { renderDescription } from '../../graphql/renderDescription.js';
import { PanelAnnotation } from '../../graphql/styled.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

export function ValuesSection({ node }: { node: ItemContentNode }): ReactElement {
  const values = node.values;
  const translate = useSpecTranslate();
  if (!values || values.length === 0) {
    return <></>;
  }

  return (
    <ValueList>
      {values.map((value) => (
        <ValueItem key={value.name}>
          <ValueRow>
            <ValueName>{value.name}</ValueName>
            {value.deprecated && (
              <DeprecatedBadge>{translate('badges.deprecated', 'deprecated')}</DeprecatedBadge>
            )}
            {value.type && <ValueType>{value.type}</ValueType>}
          </ValueRow>
          {hasValueDescription(value.description) && (
            <ValueDescription>{renderDescription(value.description)}</ValueDescription>
          )}
        </ValueItem>
      ))}
    </ValueList>
  );
}

function hasValueDescription(description: unknown): boolean {
  if (description == null || description === '') return false;
  if (Array.isArray(description)) return description.length > 0;
  return true;
}

const ValueList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ValueItem = styled.div`
  border-bottom: 1px solid var(--border-color-primary, #e0e0e0);
  padding: var(--spacing-sm, 8px) 0;
`;

const ValueRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--spacing-xxs, 4px);
`;

const ValueName = styled.div`
  display: flex;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-sm, var(--line-height-base));
  color: var(--text-color-primary);
`;

const ValueType = styled.span`
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
`;

const ValueDescription = styled(PanelAnnotation)`
  font-size: 14px;
  line-height: var(--line-height-sm, var(--line-height-base));
  margin-top: calc(var(--spacing-unit, 4px) / 2);
`;
