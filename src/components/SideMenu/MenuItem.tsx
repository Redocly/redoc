import { observer } from 'mobx-react';
import * as React from 'react';

import { ShelfIcon } from '../../common-elements/shelfs';
import type { IMenuItem } from '../../services';
import { OperationModel } from '../../services';
import { l } from '../../services/Labels';
import { scrollIntoViewIfNeeded } from '../../utils';
import { shortenHTTPVerb } from '../../utils/openapi';
import { OptionsContext } from '../OptionsProvider';
import { MenuItems } from './MenuItems';
import { MenuItemLabel, MenuItemLi, MenuItemTitle, OperationBadge } from './styled.elements';

export interface MenuItemProps {
  item: IMenuItem;
  onActivate?: (item: IMenuItem) => void;
  withoutChildren?: boolean;
  children?: React.ReactChild;
}

@observer
export class MenuItem extends React.Component<MenuItemProps> {
  ref = React.createRef<HTMLLabelElement>();

  activate = (evt: React.MouseEvent<HTMLElement>) => {
    this.props.onActivate!(this.props.item);
    evt.stopPropagation();
  };

  componentDidMount() {
    this.scrollIntoViewIfActive();
  }

  componentDidUpdate() {
    this.scrollIntoViewIfActive();
  }

  scrollIntoViewIfActive() {
    if (this.props.item.active && this.ref.current) {
      scrollIntoViewIfNeeded(this.ref.current);
    }
  }

  render() {
    const { item, withoutChildren } = this.props;
    return (
      <MenuItemLi
        tabIndex={0}
        onClick={this.activate}
        onKeyDown={evt => {
          // Space or Enter key will activate the menu item
          if (evt.key === 'Enter' || evt.key === ' ') {
            this.props.onActivate!(this.props.item);
            evt.stopPropagation();
          }
        }}
        depth={item.depth}
        data-item-id={item.id}
        role="menuitem"
        aria-label={item.sidebarLabel}
        aria-expanded={item.expanded}
      >
        {item.type === 'operation' ? (
          <OperationMenuItemContent {...this.props} item={item as OperationModel} />
        ) : (
          <MenuItemLabel $depth={item.depth} $active={item.active} $type={item.type} ref={this.ref}>
            {item.type === 'schema' && <OperationBadge type="schema">schema</OperationBadge>}
            <MenuItemTitle width="calc(100% - 38px)" title={item.sidebarLabel}>
              {item.sidebarLabel}
              {this.props.children}
            </MenuItemTitle>
            {(item.depth > 0 && item.items.length > 0 && (
              <ShelfIcon float={'right'} direction={item.expanded ? 'down' : 'right'} />
            )) ||
              null}
          </MenuItemLabel>
        )}
        {!withoutChildren && item.items && item.items.length > 0 && (
          <MenuItems
            expanded={item.expanded}
            items={item.items}
            onActivate={this.props.onActivate}
          />
        )}
      </MenuItemLi>
    );
  }
}

export interface OperationMenuItemContentProps {
  item: OperationModel;
  children?: React.ReactChild;
}

export const OperationMenuItemContent = observer((props: OperationMenuItemContentProps) => {
  const { item } = props;
  const ref = React.createRef<HTMLLabelElement>();
  const { showWebhookVerb } = React.useContext(OptionsContext);

  React.useEffect(() => {
    if (props.item.active && ref.current) {
      scrollIntoViewIfNeeded(ref.current);
    }
  }, [props.item.active, ref]);

  return (
    <MenuItemLabel
      $depth={item.depth}
      $active={item.active}
      $deprecated={item.deprecated}
      ref={ref}
    >
      {item.badges &&
        item.badges?.map(({ name, color }) => (
          <OperationBadge type="badge" color={color} key={name}>
            {name}
          </OperationBadge>
        ))}
      {item.isWebhook ? (
        <OperationBadge type="hook">
          {showWebhookVerb ? item.httpVerb : l('webhook')}
        </OperationBadge>
      ) : (
        <OperationBadge type={item.httpVerb}>{shortenHTTPVerb(item.httpVerb)}</OperationBadge>
      )}
      <MenuItemTitle tabIndex={0} width="calc(100% - 38px)">
        {item.sidebarLabel}
        {props.children}
      </MenuItemTitle>
    </MenuItemLabel>
  );
});
