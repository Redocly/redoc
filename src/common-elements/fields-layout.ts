import { transparentize } from 'polished';
import styled from '../styled-components';
import { deprecatedCss } from './mixins';

export const PropertiesTableCaption = styled.caption`
  text-align: right;
  font-size: 0.9em;
  font-weight: normal;
  color: ${props => transparentize(0.6, props.theme.colors.text)};
`;

export const PropertyCell = styled.td`
  border-left: 1px solid ${props => props.theme.schemaView.linesColor};
  box-sizing: border-box;
  position: relative;
  padding: 10px 10px 10px 0;

  tr:first-of-type > &,
  tr.last > & {
    border-left-width: 0;
    background-position: top left;
    background-repeat: no-repeat;
    background-size: 1px 100%;
  }

  tr:first-of-type > & {
    background-image: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 21px,
      ${props => props.theme.schemaView.linesColor} 21px,
      ${props => props.theme.schemaView.linesColor} 100%
    );
  }

  tr.last > & {
    background-image: linear-gradient(
      to bottom,
      ${props => props.theme.schemaView.linesColor} 0%,
      ${props => props.theme.schemaView.linesColor} 21px,
      transparent 21px,
      transparent 100%
    );
  }

  tr.last + tr > & {
    border-left-color: transparent;
  }

  tr:only-child > & {
    background: none;
    border-left-color: transparent;
  }
`;

export const PropertyCellWithInner = PropertyCell.extend`
  padding: 0;
`;

export const PropertyNameCell = PropertyCell.extend`
  vertical-align: top;
  line-height: 20px;
  white-space: nowrap;
  font-size: 0.929em;
  font-weight: 300;
  font-family: ${props => props.theme.headingsFont.family};

  &.deprecated {
    ${deprecatedCss};
  }
`;

export const PropertyDetailsCell = styled.td`
  border-bottom: 1px solid #9fb4be;
  padding: 10px 0;
  width: ${props => props.theme.schemaView.defaultDetailsWidth};
  box-sizing: border-box;

  tr.expanded & {
    border-bottom: none;
  }
`;

export const PropertyBullet = styled.span`
  color: ${props => props.theme.schemaView.linesColor};
  font-family: ${props => props.theme.code.fontFamily};
  margin-right: 10px;

  &::before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 10px;
    height: 1px;
    background: ${props => props.theme.schemaView.linesColor};
  }

  &::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 1px;
    background: ${props => props.theme.schemaView.linesColor};
    height: 7px;
  }
`;

export const InnerPropertiesWrap = styled.div`
  padding: 1em;
`;

export const PropertiesTable = styled.table`
  border-collapse: collapse;
  border-radius: 3px;

  border-spacing: 0;
  width: 100%;

  > tr {
    vertical-align: middle;
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
    margin: 1em 0 1em 1em;
    background: #f0f0f0;
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
    background: #ffffff;
  }
`;
