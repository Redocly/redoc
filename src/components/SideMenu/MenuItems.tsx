import { observer } from 'mobx-react';
import * as React from 'react';

import type { IMenuItem } from '../../services';

import { MenuItem } from './MenuItem';
import { MenuItemUl } from './styled.elements';

export interface MenuItemsProps {
  items: IMenuItem[];
  expanded?: boolean;
  onActivate?: (item: IMenuItem) => void;
  style?: React.CSSProperties;
  root?: boolean;

  className?: string;
}

@observer
export class MenuItems extends React.Component<MenuItemsProps> {
  render() {
    const { items, root, className } = this.props;
    const expanded = this.props.expanded == null ? true : this.props.expanded;
    return (
      <MenuItemUl
        className={className}
        style={this.props.style}
        $expanded={expanded}
        {...(root ? { role: 'menu' } : {})}
      >
        {items.map((item, idx) => (
          <MenuItem key={idx} item={item} onActivate={this.props.onActivate} />
        ))}
      </MenuItemUl>
    );
  }
}
