import * as React from 'react';

import ApiInfoContainer from '../ApiInfo/ApiInfoContainer';
import { RedocWrap, MenuContent, ApiContent, Background } from './elements';
import ApiLogo from '../ApiLogo/ApiLogo';
import SideMenu from '../SideMenu/SideMenu';
import ContentContainer from '../ContentItems/ContentContainer';

export class ContentRoot extends React.Component {
  render() {
    return (
      <RedocWrap className="redoc-wrap">
        <MenuContent className="menu-content">
          <ApiLogo />
          <SideMenu />
        </MenuContent>
        <Background className="background-wrap">
          <div className="redoc-background" />
        </Background>
        <ApiContent className="api-content">
          <ApiInfoContainer />
          <ContentContainer />
        </ApiContent>
      </RedocWrap>
    );
  }
}
