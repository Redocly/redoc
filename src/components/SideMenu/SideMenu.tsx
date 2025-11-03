import { observer } from 'mobx-react';
import * as React from 'react';

import { MenuStore } from '../../services';
import type { IMenuItem } from '../../services';
import { OptionsContext } from '../OptionsProvider';
import { MenuItems } from './MenuItems';

import { PerfectScrollbarWrap } from '../../common-elements/perfect-scrollbar';

@observer
export class SideMenu extends React.Component<{ menu: MenuStore; className?: string }> {
  static contextType = OptionsContext;
  declare context: React.ContextType<typeof OptionsContext>;
  private _updateScroll?: () => void;

  render() {
    const store = this.props.menu;
    return (
      <PerfectScrollbarWrap
        updateFn={this.saveScrollUpdate}
        className={this.props.className}
        options={{
          wheelPropagation: false,
        }}
      >
        <MenuItems items={store.items} onActivate={this.activate} root={true} />
      </PerfectScrollbarWrap>
    );
  }

  activate = (item: IMenuItem) => {
    if (item && item.active && this.context.menuToggle) {
      return item.expanded ? item.collapse() : item.expand();
    }
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
