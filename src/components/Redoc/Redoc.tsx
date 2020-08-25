import * as PropTypes from 'prop-types';
import * as React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { ThemeProvider } from '../../styled-components';
import { OptionsProvider } from '../OptionsProvider';

import { AppStore } from '../../services';
import { ApiInfo } from '../ApiInfo/';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { ContentItems } from '../ContentItems/ContentItems';
import { SideMenu } from '../SideMenu/SideMenu';
import { StickyResponsiveSidebar } from '../StickySidebar/StickyResponsiveSidebar';
import { ApiContentWrap, BackgroundStub, RedocWrap } from './styled.elements';

import { SearchBox } from '../SearchBox/SearchBox';
import { StoreProvider } from '../StoreBuilder';
import components from '../../markdown/components';

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
      store: { spec, menu, options, search, marker, markdownIndex },
    } = this.props;
    const store = this.props.store;

    return (
      <ThemeProvider theme={options.theme}>
        <StoreProvider value={this.props.store}>
          <OptionsProvider value={options}>
            <MDXProvider components={components}>
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
                  {markdownIndex &&
                    markdownIndex.components.map((MDXComponent, idx) => {
                      return <MDXComponent key={`mdx-${idx}`} />;
                    })}
                  <ContentItems items={menu.items as any} />
                </ApiContentWrap>
                <BackgroundStub />
              </RedocWrap>
            </MDXProvider>
          </OptionsProvider>
        </StoreProvider>
      </ThemeProvider>
    );
  }
}
