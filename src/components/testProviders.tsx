import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import defaultTheme, { resolveTheme } from '../theme';

export default class TestThemeProvider extends React.Component {
  render() {
    return (
      <ThemeProvider theme={resolveTheme(defaultTheme)}>
        {React.Children.only(this.props.children as any)}
      </ThemeProvider>
    );
  }
}

export function withTheme(children) {
  return <TestThemeProvider>{children}</TestThemeProvider>;
}
