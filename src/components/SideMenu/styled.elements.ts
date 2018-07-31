import * as classnames from 'classnames';

import { deprecatedCss, ShelfIcon } from '../../common-elements';
import styled, { css, withProps } from '../../styled-components';

export const OperationBadge = withProps<{ type: string }>(styled.span).attrs({
  className: props => `operation-type ${props.type}`,
})`
  width: 26px;
  display: inline-block;
  height: ${props => props.theme.typography.code.fontSize};;
  background-color: #333;
  border-radius: 3px;
  vertical-align: top;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAACgCAMAAADZ0KclAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////////VXz1bAAAAAJ0Uk5T/wDltzBKAAAA80lEQVR42uSWSwLCIAxEX+5/aa2QZBJw5UIt9QMdRqSPEAAw/TyvqzZf150NzdXL49qreXwXjeqz9bqN1tgJl/KLyaVrrL7K7gx+1vlNMqy+helOO4rfBGYZiEkq1ubQ3DeKvc97Et+d+e01vIZlLZZqb1WNJFd8ZKYsmv4Hh3H2fDgjMUI5WSExjiEZs7rEZ5T+/jQn9lhgsw53j/e9MQtxqPsbZY54M5fNl/MY/f1s7NbRSkYlYjc0KPsWMrmhIU9933ywxDiSE+upYNH8TdusUotllNvcAUzfnE/NC4OSYyklQhpdl9E4Tw0Cm4/G9xBgAO7VCkjWLOMfAAAAAElFTkSuQmCC");
  background-repeat: no-repeat;
  background-position: 6px 4px;
  text-indent: -9000px;
  margin-right: 6px;
  margin-top: 2px;

  &.get {
    background-position: 8px -12px;
    background-color: ${props => props.theme.colors.http.get};
  }

  &.post {
    background-position: 6px 4px;
    background-color: ${props => props.theme.colors.http.post};
  }

  &.put {
    background-position: 8px -28px;
    background-color: ${props => props.theme.colors.http.put};
  }

  &.options {
    background-position: 4px -148px;
    background-color: ${props => props.theme.colors.http.options};
  }

  &.patch {
    background-position: 4px -114px;
    background-color: ${props => props.theme.colors.http.patch};
  }

  &.delete {
    background-position: 4px -44px;
    background-color: ${props => props.theme.colors.http.delete};
  }

  &.basic {
    background-position: 5px -79px;
    background-color: ${props => props.theme.colors.http.basic};
  }

  &.link {
    background-position: 4px -131px;
    background-color: ${props => props.theme.colors.http.link};
  }

  &.head {
    background-position: 6px -102px;
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
}>(styled.label).attrs({
  role: 'menuitem',
  className: props =>
    classnames('-depth' + props.depth, {
      active: props.active,
    }),
})`
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
  font-size: 0.8em;
  margin-top: ${({ theme }) => `${theme.spacing.unit * 2}px`};
  padding: ${({ theme }) => `0 ${theme.spacing.unit * 4}px`};
  text-align: left;

  opacity: 0.7;

  a,
  a:visited,
  a:hover {
    color: ${({ theme }) => theme.colors.text.primary} !important;
    border-top: 1px solid #e1e1e1;
    padding-top: 10px;
    display: block;
  }
`;
