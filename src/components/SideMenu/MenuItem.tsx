import { observer } from 'mobx-react';
import * as React from 'react';

import { ShelfIcon } from '../../common-elements/shelfs';
import { IMenuItem, OperationModel } from '../../services';
import { MenuItems } from './MenuItems';
import { MenuItemLabel, MenuItemLi, MenuItemTitle, OperationBadge } from './styled.elements';

interface MenuItemProps {
  item: IMenuItem;
  onActivate?: (item: IMenuItem) => void;
  withoutChildren?: boolean;
}

@observer
export class MenuItem extends React.Component<MenuItemProps> {
  ref: Element | null;

  activate = (evt: React.MouseEvent<HTMLElement>) => {
    this.props.onActivate!(this.props.item);
    evt.stopPropagation();
  };

  componentDidUpdate() {
    if (this.props.item.active) {
      this.scrollIntoView();
    }
  }

  scrollIntoView() {
    if (this.ref) {
      this.ref.scrollIntoViewIfNeeded();
    }
  }

  saveRef = ref => {
    this.ref = ref;
  };

  render() {
    const { item, withoutChildren } = this.props;
    return (
      <MenuItemLi onClick={this.activate} depth={item.depth} innerRef={this.saveRef}>
        {item.type === 'operation' ? (
          <OperationMenuItemContent item={item as OperationModel} />
        ) : (
          <MenuItemLabel depth={item.depth} active={item.active}>
            <MenuItemTitle title={item.name}>{item.name}</MenuItemTitle>
            {(item.depth > 0 &&
              item.items.length > 0 && (
                <ShelfIcon float={'right'} direction={item.active ? 'down' : 'right'} />
              )) ||
              null}
          </MenuItemLabel>
        )}
        {!withoutChildren &&
          item.items &&
          item.items.length > 0 && (
            <MenuItems active={item.active} items={item.items} onActivate={this.props.onActivate} />
          )}
      </MenuItemLi>
    );
  }
}

export interface OperationMenuItemContentProps {
  item: OperationModel;
  className?: string;
}

@observer
class OperationMenuItemContent extends React.Component<OperationMenuItemContentProps> {
  render() {
    const { item, className } = this.props;
    return (
      <MenuItemLabel
        className={className}
        depth={item.depth}
        active={item.active}
        deprecated={item.deprecated}
      >
        <OperationBadge type={item.httpVerb} />
        <MenuItemTitle width="calc(100% - 32px)">{item.name}</MenuItemTitle>
      </MenuItemLabel>
    );
  }
}
