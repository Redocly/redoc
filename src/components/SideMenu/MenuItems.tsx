import * as React from 'react';
import { observer } from 'mobx-react';

import { IMenuItem } from '../../services';

import { MenuItemUl } from './styled.elements';
import { MenuItem } from './MenuItem';

interface MenuItemsProps {
  items: IMenuItem[];
  active?: boolean;
  onActivate?: (item: IMenuItem) => void;
}

@observer
export class MenuItems extends React.Component<MenuItemsProps> {
  render() {
    const { items } = this.props;
    const active = this.props.active == null ? true : this.props.active;
    return (
      <MenuItemUl active={active}>
        {items.map((item, idx) => (
          <MenuItem key={idx} item={item} onActivate={this.props.onActivate} />
        ))}
      </MenuItemUl>
    );
  }
}
