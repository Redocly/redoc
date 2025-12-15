import { memo } from 'react';

import type { TFunction } from '@redocly/theme/core/openapi';
import type { OperationsNavigationProps } from './types.js';

import { getOperationColor } from '@redocly/theme/core/openapi';

import { joinWithSeparator } from '../../services/index.js';
import { encodeBackSlashes } from '../../utils/index.js';
import { HttpVerb, NavigationBadge } from '../common/index.js';
import { styled } from '../../styled-components.js';
import { StyledButton } from './styled.js';

type OperationNavigationItemsProps = OperationsNavigationProps & {
  title: string;
  onClick: (link: string) => void;
  translate: TFunction;
};

function OperationNavigationItemsComponent({
  title,
  items,
  onClick,
  routingBasePath,
  translate,
}: OperationNavigationItemsProps) {
  return (
    <>
      <Heading>{title}</Heading>
      {items.map((item) => {
        const { id, href, deprecated, badges, isAdditionalOperation } = item;
        const title = item.type === 'operation' ? item.path : item.name;
        const httpVerb = item.type === 'operation' ? item.httpVerb : item.type;
        const httpColor = getOperationColor({
          isAdditionalOperation,
          deprecated,
          httpVerb,
        });

        return (
          <Item
            variant="outlined"
            size="large"
            key={id}
            onClick={() => onClick(joinWithSeparator(routingBasePath, encodeBackSlashes(href)))}
          >
            <span>
              <HttpVerb color={httpColor}>{httpVerb}</HttpVerb>
              <Path>{title}</Path>
              {deprecated && (
                <NavigationBadge deprecated>
                  {translate('openapi.badges.deprecated', 'Deprecated')}
                </NavigationBadge>
              )}
              {badges?.map(({ name, color }) => (
                <NavigationBadge key={name} color={color}>
                  {name}
                </NavigationBadge>
              ))}
            </span>
          </Item>
        );
      })}
    </>
  );
}

export const OperationNavigationItems = memo<OperationNavigationItemsProps>(
  OperationNavigationItemsComponent,
);

const Heading = styled.span`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-color-primary);
  margin: var(--spacing-sm) 0 var(--spacing-xxs) 0;
`;

const Item = styled(StyledButton)`
  border-radius: var(--border-radius);
  background: var(--bg-color);
  justify-content: space-between;

  & > span {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-unit);
    overflow-x: hidden;
  }

  &:hover {
    background: var(--bg-color);
  }

  &:hover::after {
    content: '→';
    line-height: var(--line-height-base);
  }
`;

const Path = styled.span`
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-primary);
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;
