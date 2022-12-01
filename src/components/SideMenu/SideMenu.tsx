import { observer } from 'mobx-react';
import * as React from 'react';

import { MenuStore } from '../../services';
import type { IMenuItem } from '../../services';
import { OptionsContext } from '../OptionsProvider';
import { MenuItems } from './MenuItems';

import { PerfectScrollbarWrap } from '../../common-elements/perfect-scrollbar';
import { RedocAttribution } from './styled.elements';

const RedoclyLogoSvg = (): JSX.Element => (
  <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#0044d4"
      d={`
        M249.488 231.49a123.68 123.68 0 0 0-22.86-12.66 111.55 111.55 0 0
        0-42.12-214.75h-171.8a8.18 8.18 0 0 0-5.78 14 7.48 7.48 0 0 0 5.78 2.48
        95 95 0 1 1 0 190c-.83 0-1.38.27-2.21.27a8 8 0 0 0-6.33 7.71v1.11a7.69
        7.69 0 0 0 7.71 7.7h5.52a92.93 92.93 0 0 1 50.66 17.62 95.33 95.33 0 0
        1 34.14 45.43 8.27 8.27 0 0 0 7.7 5.52h171.8a7.76 7.76 0 0 0 6.61-3.58
        8 8 0 0 0 1.09-7.42 109.06 109.06 0 0 0-39.91-53.43zm-158-37.16a111.62
        111.62 0 0 0 32.76-78.75 110 110 0 0 0-32.76-78.74 105.91 105.91 0 0
        0-20.37-16.24h113.39a95 95 0 1 1 0 190 3.55 3.55 0 0
        0-1.65.27H70.798a109.06 109.06 0 0 0 20.65-16.54h.04zm-13.77
        37.16c-1.92-1.37-4.13-2.75-6.33-4.13h117.8a94.79 94.79 0 0 1 80.12
        52h-153.63a112 112 0 0 0-38-47.87h.04z M158.398 115.58a8.11 8.11 0 0 0
        8.26 8.26h82.6a8.26 8.26 0 0 0 0-16.52h-82.6a8.29 8.29 0 0 0-8.26
        8.26zM152.298 156.92h82.59a8.26 8.26 0 0 0 0-16.52h-82.59a8.11 8.11 0 0
        0-8.26 8.26 8.28 8.28 0 0 0 8.26 8.26zM152.298 90.8h82.59a8.26 8.26 0 0
        0 0-16.52h-82.59a8.11 8.11 0 0 0-8.26 8.26 8.46 8.46 0 0 0 8.26 8.26z
      `}
    />
  </svg>
);

@observer
export class SideMenu extends React.Component<{ menu: MenuStore; className?: string }> {
  static contextType = OptionsContext;
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
        <RedocAttribution>
          <a target="_blank" rel="noopener noreferrer" href="https://redocly.com/redoc/">
            <RedoclyLogoSvg /> API docs by Redocly
          </a>
        </RedocAttribution>
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
