import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';

import { ThemeInterface } from './theme';

type StyledFunction<T> = styledComponents.ThemedStyledFunction<T, ThemeInterface>;

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
} = (styledComponents as ThemedStyledComponentsModule<any>) as ThemedStyledComponentsModule<
  ThemeInterface
>;

export { css, injectGlobal, keyframes, ThemeProvider, withTheme, withProps };
export default styled;
