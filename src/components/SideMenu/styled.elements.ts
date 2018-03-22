import * as classnames from 'classnames';

import { deprecatedCss } from '../../common-elements';
import styled, { css, withProps } from '../../styled-components';

export const OperationBadge = withProps<{ type: string }>(styled.span).attrs({
  className: props => `operation-type ${props.type}`,
})`
  width: 26px;
  display: inline-block;
  height: ${props => props.theme.code.fontSize};;
  background-color: #333;
  border-radius: 3px;
  vertical-align: top;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAACgCAYAAADuDlcXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNjQ5N0JDQUE3OTYxMUU0ODNGMUE0RUM3NjRDRTQyNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNjQ5N0JDQkE3OTYxMUU0ODNGMUE0RUM3NjRDRTQyNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2NDk3QkM4QTc5NjExRTQ4M0YxQTRFQzc2NENFNDI3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2NDk3QkM5QTc5NjExRTQ4M0YxQTRFQzc2NENFNDI3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+mIrGwQAAAZ9JREFUeNrsmtuOwyAMRBmU//9lbx9208ayjQ1EarSDVFW56ARIGGZIIK/S3gWvX3X7LN3a6WxDHdPnnDBpcZHEOe3wrmLUMg2zatKykPOq1/5fK71tLIQR9jjYsaJfWdWAAcRsM2W1z9LNGcFkRlmtPhvpf7qmHAGEESZqLFr/qbHaCy4Is6oxLdvT+nWr0lLPCCPsFn+mA5e2UjLycL1o6qLMiapqRGoifVCDinrgU2mRyJthzZg3CSPs+2HhIM4YGq0a4oDgiGjYTKw20/OwUzAEuXz73YSqtdsV+F1a3eZpweFEGGG7Y3ULbJRk4nYPlEHbUi86wpNtbz4oB37PICOrLEdC9DKzFv7EkQ8tYY8Nr8tuyJrRsdpMrIJ0n4GPBmGEEUbYzRMKnFwug1B7rppmbCiyBjBrQ1vC8KW/CxrF7osNrRbxMjofWsIIuwU2vapnZfTRq4/wFXl3hG9bMzP6ZWV47LoB+Gym1/EyUleKI2GEPW8pQpu80bHLvsifSWFVAVEzo2VDTxxb9T16eO7sF0vmxPNPxPFHgAEA/rGUMXq/uWcAAAAASUVORK5CYII=");
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

export const MenuItemUl = withProps<{ active: boolean }>(styled.ul)`
  margin: 0;
  padding: 0;

  & & {
    font-size: 0.929em;
  }

  ${props => (props.active ? '' : 'display: none;')};
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
    text-transform: uppercase;
    font-size: 0.8em;
    padding-bottom: 0;
    cursor: default;
    color: ${props => props.theme.colors.text};
  `,
  1: css`
    font-size: 0.929em;
    text-transform: uppercase;
    &:hover {
      color: ${props => props.theme.colors.main};
    }
  `,
  2: css`
    color: ${props => props.theme.colors.text};
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
  color: ${props => (props.active ? props.theme.colors.main : props.theme.colors.text)};
  margin: 0;
  padding: 12.5px ${props => props.theme.spacingUnit}px;
  ${({ depth, type, theme }) =>
    (type === 'section' && depth > 1 && 'padding-left: ' + theme.spacingUnit * 2 + 'px;') || ''}
  display: flex;
  justify-content: space-between;
  font-family: ${props => props.theme.headingsFont.family};
  ${props => menuItemDepth[props.depth]};
  background-color: ${props => (props.active ? menuItemActiveBg(props.depth) : '')};

  ${props => (props.deprecated && deprecatedCss) || ''};

  &:hover {
    background-color: ${props => menuItemActiveBg(props.depth)};
  }
`;

export const MenuItemTitle = withProps<{ width?: string }>(styled.span)`
  display: inline-block;
  vertical-align: middle;
  width: ${props => (props.width ? props.width : 'auto')};
  overflow: hidden;
  text-overflow: ellipsis;
`;
