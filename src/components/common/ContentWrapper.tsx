import { memo, useMemo } from 'react';
import { styled, css } from 'styled-components';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { PanelNode } from '../../types/content.js';

import { breakpoints } from '@redocly/theme/core/openapi';

import { SECTION_ATTR } from '../../constants/openapi.js';
import { layoutAtom } from '../../jotai/app.js';
import { PanelMapper } from '../panels/PanelMapper.js';

const MIDDLE_PANEL_TESTID = 'middle-panel';
const RIGHT_PANEL_TESTID = 'right-panel';

type ContentWrapperProps = {
  children: React.ReactNode;
  panels?: PanelNode[];
  sectionId?: string;
};

const ContentWrapperComponent = ({ children, panels, sectionId }: ContentWrapperProps) => {
  const layout = useAtomValue(layoutAtom);
  const isStacked = layout === LayoutVariant.STACKED;
  const rightPanel = useMemo(() => {
    return panels?.map((panel, index) => {
      const panelKey = panel.children?.[0]?.kind || 'panel';
      return <PanelMapper node={panel} key={`${panelKey}-${index}`} />;
    });
  }, [panels]);
  const sectionAttrProps = sectionId ? { [SECTION_ATTR]: sectionId } : {};

  return (
    <>
      {rightPanel ? (
        <Row $layout={layout} {...sectionAttrProps}>
          <MiddlePanel $isStacked={isStacked} data-testid={MIDDLE_PANEL_TESTID}>
            {children}
          </MiddlePanel>
          {rightPanel && (
            <RightPanel $isStacked={isStacked} data-testid={RIGHT_PANEL_TESTID}>
              {rightPanel}
            </RightPanel>
          )}
        </Row>
      ) : (
        <MiddlePanel $isStacked={isStacked} data-testid={MIDDLE_PANEL_TESTID} {...sectionAttrProps}>
          {children}
        </MiddlePanel>
      )}
    </>
  );
};

export const ContentWrapper = memo(ContentWrapperComponent);

export const Row = styled.div<{
  $layout?: LayoutVariant;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 0;

  @media screen and (min-width: ${breakpoints.large}) {
    flex-direction: ${({ $layout }) => ($layout !== LayoutVariant.STACKED ? 'row' : 'column')};
  }

  @media print {
    flex-direction: column;
  }
`;

export const MiddlePanel = styled.div<{
  $isStacked?: boolean;
}>`
  ${({ $isStacked }) => {
    return css`
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      padding: var(--spacing-sm) var(--panel-gap-horizontal);
      margin-bottom: var(--spacing-xs);

      &:empty {
        display: none;
      }

      @media screen and (min-width: ${breakpoints.large}) {
        width: ${$isStacked ? '100%' : 'calc(100% - var(--panel-samples-width))'};
        padding-left: calc(var(--panel-gap-horizontal) * 2);
        padding-right: ${$isStacked ? 'var(--panel-gap-vertical)' : 'var(--panel-gap-horizontal)'};
        padding-top: 0;
        padding-bottom: ${$isStacked ? 'var(--spacing-vertical)' : 0};
      }

      @media screen and (max-width: ${breakpoints.small}) {
        padding-top: 0;
        padding-bottom: var(--spacing-vertical);
      }

      @media print {
        width: 100%;
        padding-top: var(--spacing-vertical);
        padding-bottom: var(--spacing-vertical);
      }
    `;
  }}

  & + & {
    padding-top: 0;
  }

  & [data-testid="${MIDDLE_PANEL_TESTID}"] {
    padding-left: 0;
    padding-right: 0;
  }
  & [data-testid="${RIGHT_PANEL_TESTID}"] {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const RightPanel = styled.div<{ $isStacked: boolean }>`
  margin-left: auto;
  --code-block-padding: var(--spacing-xs) 0 var(--spacing-xs) 20px;
  color: var(--panel-samples-text-color);
  width: 100%;
  height: fit-content;
  padding-top: var(--panel-gap-vertical);
  padding-bottom: var(--panel-gap-vertical);
  padding-left: var(--panel-gap-horizontal);
  padding-right: var(--panel-gap-horizontal);
  margin-bottom: var(--spacing-sm);

  & > [data-component-name='Panel/Panel']:not(:last-child) {
    margin-bottom: var(--spacing-sm);
  }

  &:has([data-component-name='BrokerPanel/BrokerItem']) {
    padding-top: var(--spacing-lg);
    padding-bottom: 0;
  }

  position: sticky;
  z-index: var(--panel-z-index);
  top: calc(var(--navbar-stack-height) + var(--panel-gap-vertical));

  &:has([data-testid='items-navigation-list']) {
    position: static;
  }

  &:empty {
    display: none;
  }

  @media screen and (min-width: ${breakpoints.large}) {
    width: ${({ $isStacked }) => ($isStacked ? '100%' : 'var(--panel-samples-width)')};
    padding-top: 0;
    padding-bottom: 0;
    padding-left: ${({ $isStacked }) =>
      $isStacked ? 'calc(var(--panel-gap-horizontal) * 2)' : 'var(--panel-gap-horizontal)'};
    padding-right: ${({ $isStacked }) =>
      $isStacked ? 'var(--panel-gap-horizontal)' : 'calc(var(--panel-gap-horizontal) * 2)'};
  }

  @media print {
    width: 100%;
    padding-top: var(--spacing-vertical);
    padding-bottom: var(--spacing-vertical);
  }
`;
