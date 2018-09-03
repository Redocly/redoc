import * as classnames from 'classnames';

import { deprecatedCss, ShelfIcon } from '../../common-elements';
import styled, { css, withProps } from '../../styled-components';

export const OperationBadge = withProps<{ type: string }>(styled.span).attrs({
  className: props => `operation-type ${props.type}`,
})`
  width: 32px;
  display: inline-block;
  height: ${props => props.theme.typography.code.fontSize};
  line-height: ${props => props.theme.typography.code.fontSize};
  background-color: #333;
  border-radius: 3px;
  background-repeat: no-repeat;
  background-position: 6px 4px;
  font-size: 7px;
  font-family: Verdana; // web-safe
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  margin-right: 6px;
  margin-top: 2px;

  &.get {
    background-color: ${props => props.theme.colors.http.get};
  }

  &.post {
    background-color: ${props => props.theme.colors.http.post};
  }

  &.put {
    background-color: ${props => props.theme.colors.http.put};
  }

  &.options {
    background-color: ${props => props.theme.colors.http.options};
  }

  &.patch {
    background-color: ${props => props.theme.colors.http.patch};
  }

  &.delete {
    background-color: ${props => props.theme.colors.http.delete};
  }

  &.basic {
    background-color: ${props => props.theme.colors.http.basic};
  }

  &.link {
    background-color: ${props => props.theme.colors.http.link};
  }

  &.head {
    background-color:  ${props => props.theme.colors.http.head};
  }
`;

function menuItemActiveBg(depth): string {
  if (depth > 1) {
    return '#e1e1e1';
  } else if (depth === 1) {
    return '#f0f0f0';
  } else {
    return '';
  }
}

export const MenuItemUl = withProps<{ expanded: boolean }>(styled.ul)`
  margin: 0;
  padding: 0;

  & & {
    font-size: 0.929em;
  }

  ${props => (props.expanded ? '' : 'display: none;')};
`;

export const MenuItemLi = withProps<{ depth: number }>(styled.li)`
  list-style: none inside none;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  ${props => (props.depth === 0 ? 'margin-top: 15px' : '')};
`;

export const menuItemDepth = {
  0: css`
    opacity: 0.7;
    text-transform: ${({ theme }) => theme.menu.groupItems.textTransform};
    font-size: 0.8em;
    padding-bottom: 0;
    cursor: default;
    color: ${props => props.theme.colors.text.primary};
  `,
  1: css`
    font-size: 0.929em;
    text-transform: ${({ theme }) => theme.menu.level1Items.textTransform};
    &:hover {
      color: ${props => props.theme.colors.primary.main};
    }
  `,
  2: css`
    color: ${props => props.theme.colors.text.primary};
  `,
};

export const MenuItemLabel = withProps<{
  depth: number;
  active: boolean;
  deprecated?: boolean;
  type?: string;
}>(
  styled.label.attrs({
    role: 'menuitem',
    className: props =>
      classnames('-depth' + props.depth, {
        active: props.active,
      }),
  }),
)`
  cursor: pointer;
  color: ${props =>
    props.active ? props.theme.colors.primary.main : props.theme.colors.text.primary};
  margin: 0;
  padding: 12.5px ${props => props.theme.spacing.unit * 4}px;
  ${({ depth, type, theme }) =>
    (type === 'section' && depth > 1 && 'padding-left: ' + theme.spacing.unit * 8 + 'px;') || ''}
  display: flex;
  justify-content: space-between;
  font-family: ${props => props.theme.typography.headings.fontFamily};
  ${props => menuItemDepth[props.depth]};
  background-color: ${props => (props.active ? menuItemActiveBg(props.depth) : '')};

  ${props => (props.deprecated && deprecatedCss) || ''};

  &:hover {
    background-color: ${props => menuItemActiveBg(props.depth)};
  }

  ${ShelfIcon} {
    height: ${({ theme }) => theme.menu.arrow.size};
    width: ${({ theme }) => theme.menu.arrow.size};
    polygon {
      fill: ${({ theme }) => theme.menu.arrow.color};
    }
  }
`;

export const MenuItemTitle = withProps<{ width?: string }>(styled.span)`
  display: inline-block;
  vertical-align: middle;
  width: ${props => (props.width ? props.width : 'auto')};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RedocAttribution = styled.div`
  ${({ theme }) => `
  font-size: 0.8em;
  margin-top: ${theme.spacing.unit * 2}px;
  padding: 0 ${theme.spacing.unit * 4}px;
  text-align: left;

  opacity: 0.7;

  a,
  a:visited,
  a:hover {
    color: ${theme.colors.text.primary} !important;
    border-top: 1px solid #e1e1e1;
    padding: ${theme.spacing.unit}px 0;
    display: block;
  }
`};
`;
