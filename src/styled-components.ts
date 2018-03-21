import * as styledComponents from 'styled-components';

import { ResolvedThemeInterface } from './theme';

export type StyledFunction<T> = styledComponents.ThemedStyledFunction<T, ResolvedThemeInterface>;

function withProps<T, U extends HTMLElement = HTMLElement>(
  styledFunction: StyledFunction<React.HTMLProps<U>>,
): StyledFunction<T & React.HTMLProps<U>> {
  return styledFunction;
}

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider,
  withTheme,
} = (styledComponents as styledComponents.ThemedStyledComponentsModule<
  any
>) as styledComponents.ThemedStyledComponentsModule<ResolvedThemeInterface>;

export const media = {
  lessThan(breakpoint) {
    return (...args) => css`
      @media (max-width: ${props => props.theme.breakpoints[breakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },

  greaterThan(breakpoint) {
    return (...args) => css`
      @media (min-width: ${props => props.theme.breakpoints[breakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },

  between(firstBreakpoint, secondBreakpoint) {
    return (...args) => css`
      @media (min-width: ${props =>
          props.theme.breakpoints[firstBreakpoint]}) and (max-width: ${props =>
          props.theme.breakpoints[secondBreakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },
};

export { css, injectGlobal, keyframes, ThemeProvider, withTheme, withProps };
export { StyledComponentClass } from 'styled-components';
export default styled;
