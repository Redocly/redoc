import { palette } from '@leafygreen-ui/palette';
import { default as classnames } from 'classnames';
import { darken } from 'polished';

import { deprecatedCss, ShelfIcon } from '../../common-elements';
import styled, { css, media, ResolvedThemeInterface } from '../../styled-components';
import { getBadgeStyles } from '../../utils/styling';

export const OperationBadge = styled.span.attrs((props: { type: string }) => ({
  className: `operation-type ${props.type}`,
}))<{ type: string }>`
  width: 9ex;
  display: inline-block;
  height: ${props => props.theme.typography.code.fontSize};
  line-height: ${props => props.theme.typography.code.fontSize};
  background-color: #333;
  border: ${props => props.theme.badges.border};
  border-radius: ${props => props.theme.badges.borderRadius};
  background-repeat: no-repeat;
  background-position: 6px 4px;
  font-size: 7px;
  font-family: ${props => props.theme.typography.fontFamily};
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  margin-right: 6px;
  margin-top: 2px;

  ${props => getBadgeStyles(props.theme.colors.http[props.type], 'light')}
`;

function menuItemActive(
  depth,
  { theme }: { theme: ResolvedThemeInterface },
  option: string,
): string {
  if (depth > 1) {
    return theme.sidebar.level1Items[option];
  } else if (depth === 1) {
    return theme.sidebar.groupItems[option];
  } else {
    return '';
  }
}

// The back button and currently active labels maintain a different colors
function selectMenuLabelColor(
  props: MenuItemLabelType & { theme: ResolvedThemeInterface },
): string {
  const { active, depth, isBackButton, theme } = props;
  if (isBackButton) return palette.gray.dark1;
  return active ? menuItemActive(depth, props, 'activeTextColor') : theme.sidebar.textColor;
}

export const MenuItemUl = styled.ul<{ expanded: boolean }>`
  margin: 0;
  padding: 0;

  & & {
    font-size: 0.929em;
  }

  ${props => (props.expanded ? '' : 'display: none;')};
`;

export const MenuItemLi = styled.li<{ depth: number }>`
  list-style: none inside none;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  ${props => (props.depth === 0 ? 'margin-top: 15px' : '')};
`;

export const MenuLink = styled.a`
  text-decoration: none;
`;

export const menuItemDepth = {
  0: css`
    opacity: 0.7;
    text-transform: ${({ theme }) => theme.sidebar.groupItems.textTransform};
    font-size: 13px;
    padding-bottom: 0;
    cursor: default;
  `,
  1: css`
    font-size: 13px;
    text-transform: ${({ theme }) => theme.sidebar.level1Items.textTransform};
  `,
};

export interface MenuItemLabelType {
  depth: number;
  active: boolean;
  deprecated?: boolean;
  isBackButton?: boolean;
  type?: string;
}

export const MenuItemLabel = styled.label.attrs((props: MenuItemLabelType) => ({
  role: 'menuitem',
  className: classnames('-depth' + props.depth, {
    active: props.active,
  }),
}))<MenuItemLabelType>`
  cursor: pointer;
  color: ${props => selectMenuLabelColor(props)};
  margin: 0;
  ${props => props.isBackButton && 'margin-top: 16px;'}
  padding: 6px 16px;
  ${({ depth, type, theme }) =>
    (type === 'section' && depth > 1 && 'padding-left: ' + theme.spacing.unit * 8 + 'px;') || ''}
  display: flex;
  justify-content: space-between;
  font-family: ${props => props.theme.typography.headings.fontFamily};
  ${props => menuItemDepth[props.depth]};
  background-color: ${props =>
    props.active
      ? menuItemActive(props.depth, props, 'activeBackgroundColor')
      : props.theme.sidebar.backgroundColor};

  ${props => (props.deprecated && deprecatedCss) || ''};

  &:hover {
    color: ${props =>
      props.isBackButton
        ? palette.gray.dark1
        : menuItemActive(props.depth, props, 'activeTextColor')};
    background-color: ${palette.gray.light2};
  }

  ${ShelfIcon} {
    height: ${({ theme }) => theme.sidebar.arrow.size};
    width: ${({ theme }) => theme.sidebar.arrow.size};
    polygon {
      fill: ${({ theme }) => theme.sidebar.arrow.color};
    }
  }
`;

export const MenuBreak = styled.hr`
  border: unset;
  border-bottom: 1px solid ${palette.gray.light2};
  margin: 16px 0;
  width: 100%;
`;

export const MenuItemTitle = styled.span<{ width?: string }>`
  display: inline-block;
  vertical-align: middle;
  width: ${props => (props.width ? props.width : 'auto')};
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
`;

export const RedocAttribution = styled.div`
  ${({ theme }) => css`
    font-size: 0.8em;
    margin-top: ${theme.spacing.unit * 2}px;
    text-align: center;
    position: sticky;
    width: ${theme.sidebar.width};
    bottom: 0;
    background: ${theme.sidebar.backgroundColor};

    a,
    a:visited,
    a:hover {
      color: ${theme.sidebar.textColor} !important;
      padding: ${theme.spacing.unit}px 0;
      border-top: 1px solid ${darken(0.1, theme.sidebar.backgroundColor)};
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `};
  img {
    width: 15px;
    margin-right: 5px;
  }

  ${media.lessThan('small')`
    width: 100%;
  `};
`;
