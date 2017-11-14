import { ThemeInterface } from '../../theme';
import * as React from 'react';
import { ThemeProvider } from '../../styled-components';

import { ApiInfo } from '../ApiInfo/ApiInfo';
import { RedocWrap, MenuContent, ApiContent } from './elements';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { SideMenu } from '../SideMenu/SideMenu';
import { ContentItems } from '../ContentItems/ContentItems';
import { AppStore } from '../../services';

import defaultTheme from '../../theme';

interface RedocProps {
  store: AppStore;
  options?: {
    theme?: ThemeInterface;
  };
}

export class Redoc extends React.Component<RedocProps> {
  componentDidMount() {
    this.props.store.menu.updateOnHash();
  }

  render() {
    const { store: { spec, menu }, options = {} } = this.props;

    return (
      <ThemeProvider theme={options.theme || defaultTheme}>
        <RedocWrap className="redoc-wrap">
          <MenuContent className="menu-content">
            <ApiLogo info={spec.info} />
            <SideMenu menu={menu} />
          </MenuContent>
          <ApiContent className="api-content">
            <ApiInfo info={spec.info} externalDocs={spec.externalDocs} />
            <ContentItems items={menu.items as any} />;
          </ApiContent>
        </RedocWrap>
      </ThemeProvider>
    );
  }
}
