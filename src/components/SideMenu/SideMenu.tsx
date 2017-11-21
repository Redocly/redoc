import { ComponentWithOptions } from '../OptionsProvider';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MenuStore, IMenuItem } from '../../services/MenuStore';
import { MenuItems } from './MenuItems';

import { PerfectScrollbar } from '../../common-elements/perfect-scrollbar';

@observer
export class SideMenu extends ComponentWithOptions<{ menu: MenuStore }> {
  render() {
    const store = this.props.menu;
    const nativeScrollbars = this.options.nativeScrollbars;
    return nativeScrollbars ? (
      <MenuItems
        style={{
          overflow: 'auto',
          '-ms-overflow-style': '-ms-autohiding-scrollbar',
        }}
        items={store.items}
        onActivate={this.activate}
      />
    ) : (
      <PerfectScrollbar>
        <MenuItems items={store.items} onActivate={this.activate} />
      </PerfectScrollbar>
    );
  }

  activate = (item: IMenuItem) => {
    this.props.menu.activateAndScroll(item, true);
  };
}
