import * as PropTypes from 'prop-types';
import * as React from 'react';

import { ThemeProvider } from '../../styled-components';
import { OptionsProvider } from '../OptionsProvider';

import { AppStore, IMenuItem } from '../../services';
import { ApiInfo } from '../ApiInfo/';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { ContentItems } from '../ContentItems/ContentItems';
import { SideMenu } from '../SideMenu/SideMenu';
import { StickyResponsiveSidebar } from '../StickySidebar/StickyResponsiveSidebar';
import { ApiContentWrap, BackgroundStub, RedocWrap } from './styled.elements';

import { SearchBox } from '../SearchBox/SearchBox';
import { StoreProvider } from '../StoreBuilder';

export interface RedocProps {
  store: AppStore;
}

export interface AppState {
  activeSelection: string | undefined;
}

export interface InitializeWithSelection {
  tag: IMenuItem | undefined;
  operation: IMenuItem | undefined;
}

export class Redoc extends React.Component<RedocProps, AppState> {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
  };

  state = { activeSelection: undefined };

  HOMEPAGE_URL = "https://admin.instagram.com/admin/api/docs";

  getTagByName(tagName: string): IMenuItem | undefined {
    const menu = this.props.store.menu;
    return menu.items.find(item => item.name === tagName);
  }

  getTagFromSitePath(sitePath: string): InitializeWithSelection {
    const menu = this.props.store.menu
    const matched: InitializeWithSelection = { tag: undefined, operation: undefined };
    menu.items.filter(item => item.type === 'tag').forEach(tag => {
      tag.items.forEach(operation => {
        // @ts-ignore
        if (operation.operationId === sitePath.split('/#operation/')[1]) {
          matched.tag = operation.parent!;
          matched.operation = operation;
        }
      })
    });
    return matched;
  }

  shouldInitializeWithActiveSelection(): Boolean {
    if (this.state.activeSelection === undefined && window.location.href === this.HOMEPAGE_URL) {
      return false;
    };
    return true;
  }

  sitePathIsTag(sitePath: string): Boolean {
    return sitePath.startsWith('/#tag') && !this.sitePathIsOperation(sitePath);
  }

  sitePathIsOperation(sitePath: string): Boolean {
    return sitePath.includes('#operation');
  }

  parseSitePath(fullUrl: string): string {
    return fullUrl.split(this.HOMEPAGE_URL)[1];
  }

  nonHomepageLocationIsTag(sitePath: string) {
    const splitPath = sitePath.split('/');
    const tagIMenuItem: IMenuItem | undefined = this.getTagByName(splitPath[splitPath.length - 1]);
    if (tagIMenuItem) {
      this.setActiveSelection(tagIMenuItem);
    }
  }

  nonHomepageLocationIsOperation(sitePath: string) {
    const parsed: InitializeWithSelection = this.getTagFromSitePath(sitePath);
    if (parsed.tag && parsed.operation) {
      this.setActiveSelection(parsed.tag);
    }
  }

  nonHomepageLocationSetup() {
    if (this.shouldInitializeWithActiveSelection()) {
      const sitePath = this.parseSitePath(window.location.href);
      if (this.sitePathIsTag(sitePath)) {
        this.nonHomepageLocationIsTag(sitePath);
      } else {
        this.nonHomepageLocationIsOperation(sitePath);
      }
    };
  }

  componentDidMount() {
    this.props.store.onDidMount();
    this.nonHomepageLocationSetup();
  }

  componentDidUpdate() {
    if (this.shouldInitializeWithActiveSelection && this.sitePathIsOperation) {
      const sitePath = this.parseSitePath(window.location.href);
      const tags = this.getTagFromSitePath(sitePath);
      this.props.store.menu.activateAndScroll(tags.operation);
    }
  }

  componentWillUnmount() {
    this.props.store.dispose();
  }

  setActiveSelection = (item: IMenuItem, callback?: any) => {
    if (item && item.type === "tag") {
      if (callback) {
        this.setState({ activeSelection: item.name }, callback());
      }
      this.setState({ activeSelection: item.name });
    }
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
                    setActiveSelection={this.setActiveSelection}
                  />
                )) ||
                  null}
                <SideMenu menu={menu} setActiveSelection={this.setActiveSelection} />
              </StickyResponsiveSidebar>
              <ApiContentWrap className="api-content">
                <ApiInfo store={store} />
                <ContentItems activeSelection={this.state.activeSelection} items={menu.items as any} />
              </ApiContentWrap>
              <BackgroundStub />
            </RedocWrap>
          </OptionsProvider>
        </StoreProvider>
      </ThemeProvider>
    );
  }
}
