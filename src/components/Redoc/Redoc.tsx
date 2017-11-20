import * as React from 'react';
import Stickyfill from 'stickyfill';

import { ThemeProvider } from '../../styled-components';

import { ApiInfo } from '../ApiInfo/ApiInfo';
import { RedocWrap, StickySidebar, ApiContent } from './elements';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { SideMenu } from '../SideMenu/SideMenu';
import { ContentItems } from '../ContentItems/ContentItems';
import { AppStore } from '../../services';

import defaultTheme, { ThemeInterface } from '../../theme';

export interface RedocProps {
  store: AppStore;
  options?: {
    theme?: ThemeInterface;
  };
}

const stickyfill = Stickyfill();
export class Redoc extends React.Component<RedocProps> {
  stickyElement: Element;

  componentDidMount() {
    this.props.store.menu.updateOnHash();
    stickyfill.add(this.stickyElement);
  }

  componentWillUnmount() {
    stickyfill.remove(this.stickyElement);
  }

  render() {
    const { store: { spec, menu }, options = {} } = this.props;
    return (
      <ThemeProvider theme={{ ...options.theme, ...defaultTheme }}>
        <RedocWrap className="redoc-wrap">
          <StickySidebar
            className="menu-content"
            innerRef={el => {
              this.stickyElement = el;
            }}
          >
            <ApiLogo info={spec.info} />
            <SideMenu menu={menu} />
          </StickySidebar>
          <ApiContent className="api-content">
            <ApiInfo info={spec.info} externalDocs={spec.externalDocs} />
            <ContentItems items={menu.items as any} />
          </ApiContent>
        </RedocWrap>
      </ThemeProvider>
    );
  }
}
