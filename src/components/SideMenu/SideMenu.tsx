import * as React from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { getContext } from 'recompose';

import { BaseContainerProps } from '../../types/components';
import { IMenuItem } from '../../services/MenuStore';

import { PerfectScrollbar } from '../../common-elements/perfect-scrollbar';
import { MenuItems } from './MenuItems';

@observer
class SideMenu extends React.Component<BaseContainerProps> {
  render() {
    const store = this.props.store.menu;
    return (
      <PerfectScrollbar>
        <MenuItems items={store.items} onActivate={this.activate} />
      </PerfectScrollbar>
    );
  }

  activate = (item: IMenuItem) => {
    this.props.store.menu.activateAndScroll(item, true);
  };
}

export default getContext<BaseContainerProps>({
  store: PropTypes.object,
})(SideMenu);
