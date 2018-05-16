import { observer } from 'mobx-react';
import * as React from 'react';

import { IMenuItem } from '../../services';

import { MenuItem } from './MenuItem';
import { MenuItemUl } from './styled.elements';

export interface MenuItemsProps {
  items: IMenuItem[];
  active?: boolean;
  onActivate?: (item: IMenuItem) => void;
  style?: React.CSSProperties;
  root?: boolean;
}

@observer
export class MenuItems extends React.Component<MenuItemsProps> {
  render() {
    const { items, root } = this.props;
    const active = this.props.active == null ? true : this.props.active;
    return (
      <MenuItemUl
        style={this.props.style}
        active={active}
        {...(root ? { role: 'navigation' } : {})}
      >
        {items.map((item, idx) => (
          <MenuItem key={idx} item={item} onActivate={this.props.onActivate} />
        ))}
      </MenuItemUl>
    );
  }
}
