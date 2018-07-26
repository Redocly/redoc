import { observer } from 'mobx-react';
import * as React from 'react';
import { OptionsContext } from '../OptionsProvider';

import { IMenuItem, MenuStore } from '../../services/MenuStore';
import { MenuItems } from './MenuItems';

import { PerfectScrollbar } from '../../common-elements/perfect-scrollbar';
import { RedocAttribution } from './styled.elements';

@observer
export class SideMenu extends React.Component<{ menu: MenuStore; className?: string }> {
  private _updateScroll?: () => void;

  render() {
    const store = this.props.menu;
    return (
      <OptionsContext.Consumer>
        {options =>
          options.nativeScrollbars ? (
            <MenuItems
              className={this.props.className}
              style={{
                overflow: 'auto',
                msOverflowStyle: '-ms-autohiding-scrollbar',
              }}
              items={store.items}
              onActivate={this.activate}
              root={true}
            />
          ) : (
            <PerfectScrollbar updateFn={this.saveScrollUpdate} className={this.props.className}>
              <MenuItems items={store.items} onActivate={this.activate} root={true} />
              <RedocAttribution>
                <a target="_blank" href="https://github.com/Rebilly/ReDoc">
                  Documentation Powered by ReDoc
                </a>
              </RedocAttribution>
            </PerfectScrollbar>
          )
        }
      </OptionsContext.Consumer>
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
