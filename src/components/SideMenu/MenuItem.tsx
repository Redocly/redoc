import { observer } from 'mobx-react';
import * as React from 'react';

import { ShelfIcon } from '../../common-elements/shelfs';
import { OperationModel } from '../../services';
import { shortenHTTPVerb } from '../../utils/openapi';
import { MenuItems } from './MenuItems';
import { MenuItemLabel, MenuItemLi, MenuItemTitle, OperationBadge } from './styled.elements';
import { l } from '../../services/Labels';
import { scrollIntoViewIfNeeded } from '../../utils';
import { OptionsContext } from '../OptionsProvider';
import type { IMenuItem } from '../../services';

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
      <MenuItemLi onClick={this.activate} depth={item.depth} data-item-id={item.id} role="menuitem">
        {item.type === 'operation' ? (
          <OperationMenuItemContent {...this.props} item={item as OperationModel} />
        ) : (
          <MenuItemLabel depth={item.depth} active={item.active} type={item.type} ref={this.ref}>
            <MenuItemTitle title={item.sidebarLabel}>
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
    <MenuItemLabel depth={item.depth} active={item.active} deprecated={item.deprecated} ref={ref}>
      {item.isWebhook ? (
        <OperationBadge type="hook">
          {showWebhookVerb ? item.httpVerb : l('webhook')}
        </OperationBadge>
      ) : (
        <OperationBadge type={item.httpVerb}>{shortenHTTPVerb(item.httpVerb)}</OperationBadge>
      )}
      <MenuItemTitle width="calc(100% - 38px)">
        {item.sidebarLabel}
        {props.children}
      </MenuItemTitle>
    </MenuItemLabel>
  );
});
