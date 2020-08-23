import { observer } from 'mobx-react';
import * as React from 'react';

import { IMenuItem } from '../../services';
import { ExtraContent } from '../../services/models/ExtraContent';

import { MenuItem } from './MenuItem';
import { MenuItemUl } from './styled.elements';

export interface MenuItemsProps {
  items: IMenuItem[];
  expanded?: boolean;
  onActivate?: (item: IMenuItem) => void;
  style?: React.CSSProperties;
  root?: boolean;
  extra?: any;

  className?: string;
}

@observer
export class MenuItems extends React.Component<MenuItemsProps> {
  render() {
    const { items, root, className, extra } = this.props;
    const expanded = this.props.expanded == null ? true : this.props.expanded;
    return (
      <MenuItemUl
        className={className}
        style={this.props.style}
        expanded={expanded}
        {...(root ? { role: 'navigation' } : {})}
      >
        {extra &&
          extra.map((headline, ids) => (
            <MenuItem
              key={ids}
              item={
                new ExtraContent({ id: headline.id, name: headline.text, depth: headline.depth })
              }
              onActivate={this.props.onActivate}
            />
          ))}
        {items.map((item, idx) => (
          <MenuItem key={idx} item={item} onActivate={this.props.onActivate} />
        ))}
      </MenuItemUl>
    );
  }
}
