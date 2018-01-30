import * as styledComponents from 'styled-components';

import theme, { ThemeInterface } from './theme';

export type StyledFunction<T> = styledComponents.ThemedStyledFunction<T, ThemeInterface>;

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
>) as styledComponents.ThemedStyledComponentsModule<ThemeInterface>;

export const media = {
  lessThan(breakpoint) {
    return (...args) => css`
      @media (max-width: ${theme.breakpoints[breakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },

  greaterThan(breakpoint) {
    return (...args) => css`
      @media (min-width: ${theme.breakpoints[breakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },

  between(firstBreakpoint, secondBreakpoint) {
    return (...args) => css`
      @media (min-width: ${theme.breakpoints[firstBreakpoint]}) and (max-width: ${theme.breakpoints[
          secondBreakpoint
        ]}) {
        ${(css as any)(...args)};
      }
    `;
  },
};

export { css, injectGlobal, keyframes, ThemeProvider, withTheme, withProps };
export default styled;
