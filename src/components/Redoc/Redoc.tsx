import * as React from 'react';
import * as PropTypes from 'prop-types';

import { ThemeProvider } from '../../styled-components';

import { ApiInfo } from '../ApiInfo/ApiInfo';
import { RedocWrap, ApiContent } from './elements';
import { ApiLogo } from '../ApiLogo/ApiLogo';
import { SideMenu } from '../SideMenu/SideMenu';
import { ContentItems } from '../ContentItems/ContentItems';
import { AppStore } from '../../services';
import { OptionsProvider } from '../OptionsProvider';
import { StickySidebar } from '../StickySidebar/StickySidebar';

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
