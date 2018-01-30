import { action, computed, observable } from 'mobx';
import { querySelector } from '../utils/dom';
import { GroupModel, OperationModel, SpecStore } from './models';

import { HistoryService } from './HistoryService';
import { ScrollService } from './ScrollService';

import { flattenByProp } from '../utils';
import { GROUP_DEPTH } from './MenuBuilder';

export type MenuItemGroupType = 'group' | 'tag' | 'section';
export type MenuItemType = MenuItemGroupType | 'operation';

/** Generic interface for MenuItems */
export interface IMenuItem {
  id: string;
  absoluteIdx?: number;
  name: string;
  depth: number;
  active: boolean;
  items: IMenuItem[];
  parent?: IMenuItem;
  deprecated?: boolean;
  type: MenuItemType;

  getHash(): string;
  deactivate(): void;
  activate(): void;
}

export const SECTION_ATTR = 'data-section-id';

/**
 * Stores all side-menu related information
 */
export class MenuStore {
  /**
   * active item absolute index (when flattened). -1 means nothing is selected
   */
  activeItemIdx: number = -1;

  /**
   * cached flattened menu items to support absolute indexing
   */
  private _unsubscribe: () => void;
  private _hashUnsubscribe: () => void;
  private _items?: Array<GroupModel | OperationModel>;

  /**
   *
   * @param spec [SpecStore](#SpecStore) which contains page content structure
   * @param _scrollService scroll service instance used by this menu
   */
  constructor(private spec: SpecStore, private _scrollService: ScrollService) {
    this._unsubscribe = _scrollService.subscribe(this.updateOnScroll);
    this._hashUnsubscribe = HistoryService.subscribe(this.updateOnHash);
  }

  /**
   * top level menu items (not flattened)
   */
  @computed
  get items(): IMenuItem[] {
    if (!this._items) {
      this._items = this.spec.operationGroups;
    }
    return this._items;
  }

  /**
   * update active items on scroll
   * @param isScrolledDown whether last scroll was downside
   */
  @action.bound
  updateOnScroll(isScrolledDown: boolean): void {
    const step = isScrolledDown ? 1 : -1;
    let itemIdx = this.activeItemIdx;
    while (true) {
      if (itemIdx === -1 && !isScrolledDown) {
        break;
      }

      if (itemIdx >= this.flatItems.length - 1 && isScrolledDown) {
        break;
      }

      if (isScrolledDown) {
        const el = this.getElementAt(itemIdx + 1);
        if (this._scrollService.isElementBellow(el)) {
          break;
        }
      } else {
        const el = this.getElementAt(itemIdx);
        if (this._scrollService.isElementAbove(el)) {
          break;
        }
      }
      itemIdx += step;
    }

    this.activate(this.flatItems[itemIdx], true, true);
  }

  /**
   * update active items on hash change
   * @param hash current hash
   */
  @action.bound
  updateOnHash(hash: string = HistoryService.hash): boolean {
    if (!hash) {
      return false;
    }
    let item: IMenuItem | undefined;
    hash = hash.substr(1);
    const namespace = hash.split('/')[0];
    let ptr = decodeURIComponent(hash.substr(namespace.length + 1));
    if (namespace === 'section' || namespace === 'tag') {
      const sectionId = ptr.split('/')[0];
      ptr = ptr.substr(sectionId.length);

      let searchId;
      if (namespace === 'section') {
        searchId = hash;
      } else {
        searchId = ptr || namespace + '/' + sectionId;
      }

      item = this.flatItems.find(i => i.id === searchId);
      if (item === undefined) {
        this._scrollService.scrollIntoViewBySelector(`[${SECTION_ATTR}="${searchId}"]`);
        return false;
      }
    } else if (namespace === 'operation') {
      item = this.flatItems.find(i => {
        return (i as OperationModel).operationId === ptr;
      });
    }
    if (item) {
      this.activateAndScroll(item, false);
    }
    return item !== undefined;
  }

  /**
   * get section/operation DOM Node related to the item or null if it doesn't exist
   * @param idx item absolute index
   */
  getElementAt(idx: number): Element | null {
    const item = this.flatItems[idx];
    return (item && querySelector(`[${SECTION_ATTR}="${item.id}"]`)) || null;
  }

  /**
   * current active item
   */
  get activeItem(): IMenuItem {
    return this.flatItems[this.activeItemIdx] || undefined;
  }

  /**
   * flattened items as they appear in the tree depth-first (top to bottom in the view)
   */
  @computed
  get flatItems(): IMenuItem[] {
    const flatItems = flattenByProp(this._items || [], 'items');
    flatItems.forEach((item, idx) => (item.absoluteIdx = idx));
    return flatItems;
  }

  /**
   * activate menu item
   * @param item item to activate
   * @param updateHash [true] whether to update location hash
   * @param rewriteHistory [false] whether to rewrite browser history (do not create new enrty)
   */
  @action
  activate(
    item: IMenuItem | undefined,
    updateHash: boolean = true,
    rewriteHistory: boolean = false,
  ) {
    if ((this.activeItem && this.activeItem.id) === (item && item.id)) {
      return;
    }
    this.deactivate(this.activeItem);
    if (!item) {
      HistoryService.update('', rewriteHistory);
      return;
    }

    // do not allow activating group items
    // TODO: control over options
    if (item.depth <= GROUP_DEPTH) {
      return;
    }

    this.activeItemIdx = item.absoluteIdx!;
    if (updateHash) {
      HistoryService.update(item.getHash(), rewriteHistory);
    }

    while (item !== undefined) {
      item.activate();
      item = item.parent;
    }
  }

  /**
   * makes item and all the parents not active
   * @param item item to deactivate
   */
  deactivate(item: IMenuItem | undefined) {
    while (item !== undefined) {
      item.deactivate();
      item = item.parent;
    }
  }

  /**
   * activate menu item and scroll to it
   * @see MenuStore.activate
   */
  @action
  activateAndScroll(item: IMenuItem | undefined, updateHash: boolean, rewriteHistory?: boolean) {
    this.activate(item, updateHash, rewriteHistory);
    this.scrollToActive();
  }

  /**
   * scrolls to active section
   */
  scrollToActive(): void {
    this._scrollService.scrollIntoView(this.getElementAt(this.activeItemIdx));
  }

  dispose() {
    this._unsubscribe();
    this._hashUnsubscribe();
  }
}
