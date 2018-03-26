import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import defaultTheme from '../theme';

export default class TestThemeProvider extends React.Component {
  render() {
    return <ThemeProvider theme={defaultTheme}>{this.props.children}</ThemeProvider>;
  }
}

export function withTheme(children) {
  return <TestThemeProvider>{children}</TestThemeProvider>;
}
