import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { ReactElement } from 'react';
import type { ContentItemModel, GroupModel } from '../../models/index.js';

import { breakpoints } from '@redocly/theme/core/openapi';

import { globalOptionsAtom } from '../../jotai/store.js';
import { RightPanel } from '../RightPanel/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { Row, SamplesPanel } from '../common/index.js';
import { Items } from '../ContentItems/Items.js';
import { ContentItem } from '../ContentItem/index.js';
import { styled } from '../../styled-components.js';

interface SectionContentProps {
  items: ContentItemModel[];
  hideFooterAndHeader?: boolean;
}

export function SectionContent({ items }: SectionContentProps): ReactElement | null {
  const { routingBasePath } = useAtomValue(globalOptionsAtom);
  const layout = useAtomValue(layoutAtom);
  const isStacked = layout === LayoutVariant.STACKED;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Row layout={layout}>
        <SectionContainer layout={layout}>
          {items
            .filter(({ type }) => type === 'section')
            .map((item) => (
              <ContentItem key={item.id} item={item} routingBasePath={routingBasePath}>
                <Items items={item.items} routingBasePath={routingBasePath} />
              </ContentItem>
            ))}
        </SectionContainer>
        <RightPanelContainer isStacked={isStacked} tabIndex={0}>
          <RightPanel item={items[0] as GroupModel} />
        </RightPanelContainer>
      </Row>
      {items
        .filter(({ type }) => type !== 'section')
        .map((item) => (
          <ContentItem key={item.id} item={item} routingBasePath={routingBasePath}>
            <Items items={item.items} routingBasePath={routingBasePath} />
          </ContentItem>
        ))}
    </>
  );
}

export const SectionContainer = styled.div<{
  layout?: LayoutVariant;
}>`
  width: 100%;

  @media screen and (min-width: ${breakpoints.large}) {
    width: ${({ layout }) =>
      layout === LayoutVariant.STACKED ? '100%' : 'calc(100% - var(--panel-samples-width))'};
  }
`;

export const RightPanelContainer = styled(SamplesPanel)<{
  isStacked: boolean;
}>`
  margin: var(--spacing-base) 0;
`;
