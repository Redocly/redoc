import { Fragment, memo, type ReactElement } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';

import type { ApiItemContent } from '../types/content.js';

import { ComponentMapper } from '../components/Mapper.js';
import { ContentWrapper } from '../components/common/ContentWrapper.js';
import { routingBasePathAtom } from '../jotai/store.js';
import { compose } from '../utils/compose.js';
import { toElementId } from '../utils/url.js';
import { withItemId } from '../hoc/withItemId.js';
import { SECTION_ATTR } from '../constants/openapi.js';

function ItemPageComponent({
  content,
  itemPath,
  sectionId,
}: {
  content: ApiItemContent;
  itemPath: string;
  sectionId?: string;
}): ReactElement {
  const { children } = content || {};
  const routingBasePath = useAtomValue(routingBasePathAtom);

  const sectionAttrProps = sectionId ? { [SECTION_ATTR]: sectionId } : {};
  const elementId = itemPath ? toElementId(itemPath, routingBasePath) : undefined;

  return (
    <ItemPageWrapper
      id={elementId}
      {...sectionAttrProps}
      data-item-kind={content.itemVariant}
      data-has-divider={content.showDivider || undefined}
    >
      {children?.map((child, index) => (
        <Fragment key={`${itemPath}-${child.nodeType}-${index}`}>
          <ComponentMapper type={child.nodeType} node={child} itemPath={itemPath} />
        </Fragment>
      ))}
      {content.showDivider && (
        <ContentWrapper>
          <OperationDivider />
        </ContentWrapper>
      )}
    </ItemPageWrapper>
  );
}

export const ItemPage = compose(withItemId, memo)(ItemPageComponent);

const OperationDivider = styled.div`
  border-bottom: 1px solid var(--border-color-secondary);
`;

const ItemPageWrapper = styled.div`
  padding-top: calc(var(--spacing-unit) * 16);
  padding-bottom: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-secondary);
  width: 100%;

  &[data-item-kind^='channel'] {
    padding-top: calc(var(--spacing-unit) * 16);
    padding-bottom: 0;

  }

  &[data-item-kind='channel'],
  &[data-has-divider] {
    border-bottom: none;
  }

  &[data-item-kind='channelOperation']:not([data-has-divider]) {
    border-bottom: 1px solid var(--border-color-secondary);
  }
`;
