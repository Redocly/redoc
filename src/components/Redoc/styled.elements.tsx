import { ClassAttributes, HTMLAttributes } from 'react';

import styled, {
  media,
  ResolvedThemeInterface,
  StyledComponentClass,
} from '../../styled-components';

export const RedocWrap = styled.div`
  font-family: ${props => props.theme.baseFont.family};
  font-size: ${props => props.theme.baseFont.size};
  font-weight: ${props => props.theme.baseFont.weight};
  line-height: ${props => props.theme.baseFont.lineHeight};
  color: ${props => props.theme.colors.text};
  display: flex;
  position: relative;
  text-align: left;

  -webkit-font-smoothing: ${props => props.theme.baseFont.smoothing};
  font-smoothing: ${props => props.theme.baseFont.smoothing};
  ${props =>
    (props.theme.baseFont.optimizeSpeed && 'text-rendering: optimizeSpeed !important') || ''};

  tap-highlight-color: rgba(0, 0, 0, 0);
  text-size-adjust: 100%;

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  .redoc-markdown h1 {
    padding-top: ${props => props.theme.spacingUnit * 4}px;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.links.color};

    &:visited {
      color: ${props => props.theme.links.visited};
    }

    &:hover {
      color: ${props => props.theme.links.hover};
    }
  }
`;

export const ApiContentWrap = styled.div`
  z-index: 1;
  position: relative;
  overflow: hidden;
  width: calc(100% - ${props => props.theme.menu.width});
  ${media.lessThan('small')`
    width: 100%;
  `};
  contain: layout;
`;

export const BackgroundStub = styled.div`
  background: ${props => props.theme.rightPanel.backgroundColor};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: calc((100% - ${props => props.theme.menu.width}) * 0.4);
  ${media.lessThan('medium')`
    display: none;
  `};
`;
