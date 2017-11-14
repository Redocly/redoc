import * as React from 'react';
import { observer } from 'mobx-react';

import { MenuStore, IMenuItem } from '../../services/MenuStore';
import { MenuItems } from './MenuItems';

import { PerfectScrollbar } from '../../common-elements/perfect-scrollbar';

@observer
export class SideMenu extends React.Component<{ menu: MenuStore }> {
  render() {
    const store = this.props.menu;
    return (
      <PerfectScrollbar>
        <MenuItems items={store.items} onActivate={this.activate} />
      </PerfectScrollbar>
    );
  }

  activate = (item: IMenuItem) => {
    this.props.menu.activateAndScroll(item, true);
  };
}
