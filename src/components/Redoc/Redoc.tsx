import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ContentItems } from '../../../src/components';

import { AppStore } from '../../services';

import { ThemeProvider } from '../../styled-components';
import { ApiInfo } from '../ApiInfo/';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { OptionsProvider } from '../OptionsProvider';

import { SearchBox } from '../SearchBox/SearchBox';
import { SideMenu } from '../SideMenu/SideMenu';
import { StickyResponsiveSidebar } from '../StickySidebar/StickyResponsiveSidebar';
import { StoreProvider } from '../StoreBuilder';
import { ApiContentWrap, BackgroundStub, RedocWrap } from './styled.elements';

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
        <StoreProvider value={this.props.store}>
          <OptionsProvider value={options}>
            <RedocWrap className="redoc-wrap">
              <StickyResponsiveSidebar menu={menu} className="menu-content">
                <ApiLogo info={spec.info} />
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
          </OptionsProvider>
        </StoreProvider>
      </ThemeProvider>
    );
  }
}
