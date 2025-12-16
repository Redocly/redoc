import { css } from 'styled-components';
import { LayoutVariant } from '@redocly/config';

import { H2 } from '@redocly/theme/components/Typography/H2';
import { Markdown } from '@redocly/theme/components/Markdown/Markdown';
import { breakpoints } from '@redocly/theme/core/openapi';

import { SECTION_ATTR } from '../../constants.js';
import { styled } from '../../styled-components.js';

export const SamplesMiddlePanel = styled.div<{
  compact?: boolean;
  isStacked?: boolean;
  fullWidth?: boolean;
}>`
  ${({ compact, isStacked, fullWidth }) => {
    const vPadding = compact ? 0 : 'var(--spacing-vertical)';
    return css`
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: ${vPadding} var(--panel-gap-horizontal);

      &:empty {
        display: none;
      }

      @media screen and (min-width: ${breakpoints.large}) {
        width: ${fullWidth || isStacked ? '100%' : 'calc(100% - var(--panel-samples-width))'};
        padding-left: calc(var(--panel-gap-horizontal) * 2);
        padding-right: ${isStacked ? 'var(--panel-gap-vertical)' : 'var(--panel-gap-horizontal)'};
        padding-top: 0;
        padding-bottom: ${isStacked ? 'var(--spacing-vertical)' : 0};
      }

      @media print {
        width: 100%;
        padding-top: ${vPadding};
        padding-bottom: ${vPadding};
      }
    `;
  }};

  ${({ compact }) =>
    compact &&
    css`
      & & {
        padding-left: 0;
        padding-right: 0;
      }
    `}

  &:last-child > ${Markdown} :last-child,
  ${Markdown} article :last-child {
    margin-bottom: 0;
  }
`;

export const Section = styled.div.attrs<{ sectionId?: string }>((props) => ({
  [SECTION_ATTR]: props.sectionId,
  id: props.id,
}))<{ underlined?: boolean; sectionId?: string; expanded?: boolean }>`
  padding: 0;
  width: 100%;

  ${({ expanded }) =>
    expanded &&
    css`
      background-color: var(--layer-color);
      border-bottom: 1px solid var(--border-color-secondary);
      --code-block-bg-color: var(--bg-color);
      --code-block-controls-bg-color: var(--bg-color);
    `}

  & > &:last-child {
    min-height: initial;
  }

  @media screen and (min-width: ${breakpoints.medium}) {
    padding-top: var(--spacing-xs);

    ${({ expanded }) =>
      !expanded &&
      css`
        padding-bottom: var(--spacing-xs);
      `}
  }

  @media print {
    padding: 0;
  }

  ${({ underlined }) =>
    underlined &&
    css`
      position: relative;

      &:not(:last-of-type):after {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: block;
        content: '';
        border-bottom: 1px solid var(--border-color-primary);
      }
    `}
  ${H2} {
    position: relative;
  }
`;

export const SamplesPanel = styled.div<{ isStacked: boolean }>`
  color: var(--panel-samples-text-color);
  width: 100%;
  height: fit-content;
  padding-top: var(--panel-gap-vertical);
  padding-bottom: var(--panel-gap-vertical);
  padding-left: ${({ isStacked }) =>
    isStacked ? 'calc(var(--panel-gap-horizontal) * 2)' : 'var(--panel-gap-horizontal)'};
  padding-right: var(--panel-gap-horizontal);

  position: sticky;
  z-index: var(--panel-z-index);
  top: calc(var(--navbar-height) + var(--panel-gap-vertical));

  &:empty {
    display: none;
  }

  @media screen and (min-width: ${breakpoints.large}) {
    width: ${({ isStacked }) => (isStacked ? '100%' : 'var(--panel-samples-width)')};
    padding-top: 0;
    padding-bottom: 0;
    padding-left: ${({ isStacked }) =>
      isStacked ? 'calc(var(--panel-gap-horizontal) * 2)' : 'var(--panel-gap-horizontal)'};
    padding-right: ${({ isStacked }) =>
      isStacked ? 'var(--panel-gap-horizontal)' : 'calc(var(--panel-gap-horizontal) * 2)'};
  }

  @media print {
    width: 100%;
    padding-top: var(--spacing-vertical);
    padding-bottom: var(--spacing-vertical);
  }
`;

export const Row = styled.div<{
  layout?: LayoutVariant;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 0;

  @media screen and (min-width: ${breakpoints.large}) {
    flex-direction: ${({ layout }) => (layout !== LayoutVariant.STACKED ? 'row' : 'column')};
  }

  @media print {
    flex-direction: column;
  }
`;
