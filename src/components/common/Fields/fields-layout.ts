import { css } from 'styled-components';

import { breakpoints } from '@redocly/theme/core/openapi';

import { typography } from '../../../utils/index.js';
import { deprecatedCss } from '../mixins.js';
import { styled } from '../../../styled-components.js';

export const getCssVariable = (variable: string): string =>
  typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    : '';

export const PropertiesTableCaption = styled.caption`
  text-align: right;
  font-size: 0.9em;
  font-weight: normal;
  color: var(--text-color-secondary);
`;

const repeatingGradient = css`
  repeating-linear-gradient(0deg,
  var(--schemas-lines-color),
  var(--schemas-lines-color) 3px,
  transparent 3px,
  transparent 5px,
  var(--schemas-lines-color) 5px);
`;

export const PropertyCell = styled.td<{ kind?: string }>`
  box-sizing: border-box;
  position: relative;
  background-image: ${repeatingGradient};
  background-repeat: no-repeat;
  background-size: 1px 100%;
  display: block;
  overflow: hidden;
  padding: 0 20px;
  margin-bottom: 2px;

  @media screen and (min-width: ${breakpoints.small}) {
    display: table-cell;
    overflow: initial;
    padding: 10px;
    margin-bottom: 0;
  }

  tr:first-of-type > & {
    background-image: ${repeatingGradient};
    background-position: 0 10px;
    padding-top: 0;
  }

  tr.last > & {
    background-image: ${repeatingGradient};
    padding-bottom: 0;
    background-size: 0.9px 100%;

    @media screen and (min-width: ${breakpoints.small}) {
      background-size: 0.9px 22px;
    }
  }

  tr.last + tr > & {
    background: none;
  }

  tr.last:first-child > & {
    background-image: ${repeatingGradient};
    background-size: 0.9px 100%;
    background-position: 0 20px;

    @media screen and (min-width: ${breakpoints.small}) {
      background-size: 0.9px 22px;
      background-position: 0 0;
    }
  }
`;

export const PropertyCellWithInner = styled(PropertyCell)`
  padding: 0;
`;

export const PropertyNameCell = styled(PropertyCell)`
  vertical-align: top;
  line-height: 23px;
  white-space: nowrap;
  font-size: 14px;
  font-family: var(--field-name-font-family);

  &.deprecated {
    ${deprecatedCss};
  }

  ${({ kind }) =>
    kind === 'patternProperties' &&
    css`
      span.field-name {
        white-space: break-spaces;
        text-align: left;
        display: inline-table;
        line-height: 1.5;
      }
    `}

  ${() => {
    const breakFieldNames = getCssVariable('--schema-field-name-word-break');

    if (['break-all', 'break-word'].includes(breakFieldNames)) {
      const wordBreakCSS = `
      && span:last-child {
        white-space: normal;
        word-break: ${breakFieldNames};
        vertical-align: top;
        max-width: calc(100% - 21px);
        display: inline-flex;
      }
    `;
      return css`
        ${typography('schemas-property-name')}
        ${wordBreakCSS}
      `;
    }

    return typography('schemas-property-name');
  }};

  .field-name {
    display: inline-flex;
    align-items: center;
  }
`;

export const PropertyDetailsCell = styled.td`
  box-sizing: border-box;
  vertical-align: top;

  tr.expanded & {
    border-bottom: none;
  }

  tr.last > & {
    border: none;
    background-position: top left;
    background-repeat: no-repeat;
    background-size: 1px 100%;
    padding-bottom: 0;

    /* workaround for discriminator dropdown oveflowing scrolling container,
    fixes the issue for the last item in the schema only */
    & > div > div.dropdown > .dropdown-selector-content {
      position: relative;
    }
  }

  tr:first-of-type > & {
    padding-top: 0;
  }

  border-bottom: none;
  border-left: 1px solid var(--schemas-lines-color);
  padding: 0 20px;
  width: var(--schema-default-details-width);
  min-width: 200px;

  @media screen and (min-width: ${breakpoints.small}) {
    border-bottom: 1px solid var(--border-color-primary);
    border-left: none;
    padding: 10px 0;
  }
`;

export const PropertyBullet = styled.span`
  margin-right: 10px;
  color: var(--schemas-lines-color);
  font-family: var(--code-font-family);
  width: var(--schema-default-details-width);
  border-left: 1px dashed var(--schemas-lines-color);
  padding: 5px 10px;

  @media screen and (min-width: ${breakpoints.small}) {
    border-left: none;
    padding: 10px;
  }

  &::before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 10px;
    height: 1px;
    background: var(--schemas-lines-color);
  }
`;

export const InnerPropertiesWrap = styled.div`
  padding: var(--schema-nested-offset);
`;

export const PropertiesTable = styled.table`
  border-collapse: separate;
  border-radius: var(--border-radius);
  width: 100%;
  font-size: var(--font-size-base);
  display: block;

  @media screen and (min-width: ${breakpoints.small}) {
    display: table;
  }

  > tr,
  > tbody > tr {
    display: block;
    margin-bottom: 10px;
    border-spacing: 0;

    @media screen and (min-width: ${breakpoints.small}) {
      display: table-row;
      margin-bottom: 0;
      border-spacing: 0 2px;
    }
  }

  > tr {
    vertical-align: middle;
  }

  @media screen and (max-width: ${breakpoints.small}) and (-ms-high-contrast: none) {
    td {
      float: left;
      width: 100%;
    }
  }

  &
    ${InnerPropertiesWrap},
    &
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap},
    &
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap} {
    margin-left: var(--schema-nested-offset);
    margin-bottom: var(--schema-nested-offset);
    background: var(--schema-nested-background-color);
    border-radius: var(--panel-border-radius);
  }

  &
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap},
    &
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap},
    &
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap}
    ${InnerPropertiesWrap} {
    background: var(--panel-bg-color, #fff);
  }
`;
