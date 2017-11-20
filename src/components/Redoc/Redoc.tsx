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
import { RedocRawOptions } from '../../services/RedocNormalizedOptions';

import defaultTheme from '../../theme';

export interface RedocProps {
  store: AppStore;
  options?: RedocRawOptions;
}

export class Redoc extends React.Component<RedocProps> {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
    options: PropTypes.object,
  };

  componentDidMount() {
    this.props.store.menu.updateOnHash();
  }

  render() {
    const { store: { spec, menu }, options = {} } = this.props;
    return (
      <ThemeProvider theme={{ ...options.theme, ...defaultTheme }}>
        <OptionsProvider options={options}>
          <RedocWrap className="redoc-wrap">
            <StickySidebar className="menu-content">
              <ApiLogo info={spec.info} />
              <SideMenu menu={menu} />
            </StickySidebar>
            <ApiContent className="api-content">
              <ApiInfo info={spec.info} externalDocs={spec.externalDocs} />
              <ContentItems items={menu.items as any} />
            </ApiContent>
          </RedocWrap>
        </OptionsProvider>
      </ThemeProvider>
    );
  }
}
