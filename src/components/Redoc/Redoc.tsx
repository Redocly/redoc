import * as PropTypes from 'prop-types';
import * as React from 'react';

import { ThemeProvider } from '../../styled-components';

import { AppStore } from '../../services';
import { ApiInfo } from '../ApiInfo/ApiInfo';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { ContentItems } from '../ContentItems/ContentItems';
import { OptionsProvider } from '../OptionsProvider';
import { SideMenu } from '../SideMenu/SideMenu';
import { StickyResponsiveSidebar } from '../StickySidebar/StickyResponsiveSidebar';
import { ApiContent, RedocWrap } from './elements';

import { SearchBox } from '../SearchBox/SearchBox';

export interface RedocProps {
  store: AppStore;
}

export class Redoc extends React.Component<RedocProps> {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
  };

  componentDidMount() {
    this.props.store.menu.updateOnHash();
  }

  componentWillUnmount() {
    this.props.store.dispose();
  }

  render() {
    const { store: { spec, menu, options, search } } = this.props;
    const store = this.props.store;
    return (
      <ThemeProvider theme={options.theme}>
        <OptionsProvider options={options}>
          <RedocWrap className="redoc-wrap">
            <StickyResponsiveSidebar menu={menu} className="menu-content">
              <ApiLogo info={spec.info} />
              <SearchBox
                search={search}
                getItemById={menu.getItemById}
                onActivate={menu.activateAndScroll}
              />
              <SideMenu menu={menu} />
            </StickyResponsiveSidebar>
            <ApiContent className="api-content">
              <ApiInfo store={store} />
              <ContentItems items={menu.items as any} />
            </ApiContent>
          </RedocWrap>
        </OptionsProvider>
      </ThemeProvider>
    );
  }
}
