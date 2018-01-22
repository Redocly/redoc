import * as PropTypes from 'prop-types';
import * as React from 'react';

import { ThemeProvider } from '../../styled-components';

import { AppStore } from '../../services';
import { ApiInfo } from '../ApiInfo/ApiInfo';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { ContentItems } from '../ContentItems/ContentItems';
import { OptionsProvider } from '../OptionsProvider';
import { SideMenu } from '../SideMenu/SideMenu';
import { StickySidebar } from '../StickySidebar/StickySidebar';
import { ApiContent, RedocWrap } from './elements';

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
    const { store: { spec, menu, options } } = this.props;
    const store = this.props.store;
    return (
      <ThemeProvider theme={options.theme}>
        <OptionsProvider options={options}>
          <RedocWrap className="redoc-wrap">
            <StickySidebar className="menu-content">
              <ApiLogo info={spec.info} />
              <SideMenu menu={menu} />
            </StickySidebar>
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
