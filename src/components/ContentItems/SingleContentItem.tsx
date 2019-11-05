import { observer } from 'mobx-react';
import * as React from 'react';
import { IMenuItem, MenuStore } from '../../services';
import { ContentItems } from './ContentItems';

@observer
export class SingleContentItem extends React.Component<{
  menu: MenuStore;
}> {
  extractActive(menu: MenuStore): IMenuItem[] {
    const active = menu.flatItems[menu.activeItemIdx];
    if (!active) {
      return [menu.flatItems[0]];
    }
    if (active.type !== 'operation') {
      return [{ ...active, items: [] }];
    }
    return [active];
  }

  render() {
    const { menu } = this.props;
    const activeItems = this.extractActive(menu);
    return <ContentItems items={activeItems as any} />;
  }
}
