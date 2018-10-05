import * as React from 'react';
import * as styledComponents from 'styled-components';

import { ResolvedThemeInterface } from './theme';

export { ResolvedThemeInterface };

export type InterpolationFunction<P> = styledComponents.InterpolationFunction<P>;

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
} = (styledComponents as any) as styledComponents.ThemedStyledComponentsModule<
  ResolvedThemeInterface
>;

export const media = {
  lessThan(breakpoint, print?: boolean) {
    return (...args) => css`
      @media ${print ? 'print, ' : ''} screen and (max-width: ${props =>
          props.theme.breakpoints[breakpoint]}) {
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

export { css, injectGlobal, keyframes, ThemeProvider, withProps };
export default styled;

export function extensionsHook(styledName: string) {
  return props => {
    if (!props.theme.extensionsHook) {
      return;
    }
    return props.theme.extensionsHook(styledName, props);
  };
}
