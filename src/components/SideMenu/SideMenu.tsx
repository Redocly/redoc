import { observer } from 'mobx-react';
import * as React from 'react';
import { ComponentWithOptions } from '../OptionsProvider';

import { IMenuItem, MenuStore } from '../../services/MenuStore';
import { MenuItems } from './MenuItems';

import { PerfectScrollbar } from '../../common-elements/perfect-scrollbar';

@observer
export class SideMenu extends ComponentWithOptions<{ menu: MenuStore }> {
  private _updateScroll?: () => void;

  render() {
    const store = this.props.menu;
    const nativeScrollbars = this.options.nativeScrollbars;
    return nativeScrollbars ? (
      <MenuItems
        style={{
          overflow: 'auto',
          msOverflowStyle: '-ms-autohiding-scrollbar',
        }}
        items={store.items}
        onActivate={this.activate}
      />
    ) : (
      <PerfectScrollbar updateFn={this.saveScrollUpdate}>
        <MenuItems items={store.items} onActivate={this.activate} />
      </PerfectScrollbar>
    );
  }

  activate = (item: IMenuItem) => {
    this.props.menu.activateAndScroll(item, true);
    setTimeout(() => {
      if (this._updateScroll) {
        this._updateScroll();
      }
    });
  };

  private saveScrollUpdate = upd => {
    this._updateScroll = upd;
  };
}
