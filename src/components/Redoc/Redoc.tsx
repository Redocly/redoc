import * as PropTypes from 'prop-types';
import * as React from 'react';
import { UnifiedFooter, UnifiedNav } from '@mdb/consistent-nav';

import { ThemeProvider } from '../../styled-components';
import { OptionsProvider } from '../OptionsProvider';

import { AppStore } from '../../services';
import { ApiInfo } from '../ApiInfo/';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { ContentItems } from '../ContentItems/ContentItems';
import { SideMenu, SideMenuBackButton } from '../SideMenu';
import { StickyResponsiveSidebar } from '../StickySidebar/StickyResponsiveSidebar';
import {
  ApiContentWrap,
  BackgroundStub,
  RedocWrap,
  SideMenuTitle,
  StyledHeader,
} from './styled.elements';

import { SearchBox } from '../SearchBox/SearchBox';
import { StoreProvider } from '../StoreBuilder';

export interface RedocProps {
  store: AppStore;
}

export class Redoc extends React.Component<RedocProps> {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
  };

  componentDidMount() {
    this.props.store.onDidMount();
  }

  componentWillUnmount() {
    this.props.store.dispose();
  }

  render() {
    const {
      store: { spec, menu, options, search, marker },
    } = this.props;
    const store = this.props.store;

    return (
      <ThemeProvider theme={options.theme}>
        <StoreProvider value={store}>
          <OptionsProvider value={options}>
            <StyledHeader>
              <UnifiedNav position="relative" property={{ name: 'DOCS', searchParams: [] }} />
            </StyledHeader>
            <RedocWrap className="redoc-wrap">
              <StickyResponsiveSidebar menu={menu} className="menu-content">
                <ApiLogo info={spec.info} />
                <SideMenuBackButton
                  backNavigationPath={options.customOptions?.backNavigationPath}
                  siteTitle={options.customOptions?.siteTitle}
                />
                <SideMenuTitle>{store.spec.info.title}</SideMenuTitle>
                {(!options.disableSearch && (
                  <SearchBox
                    search={search!}
                    marker={marker}
                    getItemById={menu.getItemById}
                    onActivate={menu.activateAndScroll}
                  />
                )) ||
                  null}
                <SideMenu menu={menu} />
              </StickyResponsiveSidebar>
              <ApiContentWrap className="api-content">
                <ApiInfo store={store} />
                <ContentItems items={menu.items as any} />
              </ApiContentWrap>
              <BackgroundStub />
            </RedocWrap>
            <UnifiedFooter hideLocale={true} />
          </OptionsProvider>
        </StoreProvider>
      </ThemeProvider>
    );
  }
}
