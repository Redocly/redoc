import { OperationModel, SpecStore } from './models';
import { computed, action } from 'mobx';

import { ScrollService } from './ScrollService';
import { HistoryService } from './HistoryService';

import { GROUP_DEPTH } from './MenuBuilder';
import { flattenByProp } from '../utils';

export type MenuItemGroupType = 'group' | 'tag' | 'section';
export type MenuItemType = MenuItemGroupType | 'operation';

/** Generic interface for MenuItems */
export interface IMenuItem {
  id: string;
  absoluteIdx?: number;
  name: string;
  depth: number;
  active: boolean;
  items: Array<IMenuItem>;
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
   * cached flattened menu items to support absolute indexing
   */
  private _flatItems: IMenuItem[];
  private _unsubscribe: Function;
  private _hashUnsubscribe: Function;

  /**
   * active item absolute index (when flattened). -1 means nothing is selected
   */
  activeItemIdx: number = -1;

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
    return this.spec.operationGroups;
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
  updateOnHash(hash: string): boolean {
    if (!hash) return false;
    let item: IMenuItem | undefined;
    hash = hash.substr(1);
    let namespace = hash.split('/')[0];
    let ptr = decodeURIComponent(hash.substr(namespace.length + 1));
    if (namespace === 'section' || namespace === 'tag') {
      let sectionId = ptr.split('/')[0];
      ptr = ptr.substr(sectionId.length);

      let searchId;
      if (namespace === 'section') {
        searchId = hash;
      } else {
        searchId = ptr || namespace + '/' + sectionId;
      }

      item = this.flatItems.find(item => item.id === searchId);
      if (item === undefined) {
        this._scrollService.scrollIntoViewBySelector(`[${SECTION_ATTR}="${searchId}"]`);
        return false;
      }
    } else if (namespace === 'operation') {
      item = this.flatItems.find(item => {
        return (item as OperationModel).operationId === ptr;
      });
    }
    this.activateAndScroll(item, false);
    return item !== undefined;
  }

  /**
   * get section/operation DOM Node related to the item or null if it doesn't exist
   * @param idx item absolute index
   */
  getElementAt(idx: number): Element | null {
    const item = this.flatItems[idx];
    return (item && document.querySelector(`[${SECTION_ATTR}="${item.id}"]`)) || null;
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
  get flatItems(): IMenuItem[] {
    if (!this._flatItems) {
      this._flatItems = flattenByProp(this.items, 'items');
    }

    this._flatItems.forEach((item, idx) => (item.absoluteIdx = idx));

    return this._flatItems;
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
