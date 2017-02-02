'use strict';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, HostBinding } from '@angular/core';
import { Marker, SearchService, MenuService, MenuItem } from '../../services/';

@Component({
  selector: 'redoc-search',
  styleUrls: ['./redoc-search.css'],
  templateUrl: './redoc-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedocSearch implements OnInit {
  logo:any = {};
  items: { menuItem: MenuItem, pointers: string[] }[] = [];

  _subscription;

  constructor(
    cdr: ChangeDetectorRef,
    private marker: Marker,
    public search: SearchService,
    public menu: MenuService) {
    this._subscription = menu.changed.subscribe(() => {
      cdr.markForCheck();
      cdr.detectChanges();
    });
  }

  init() {
    this.search.indexAll();
  }

  update(val) {
    let searchRes = this.search.search(val);
    this.items = Object.keys(searchRes).map(id => ({
      menuItem: this.menu.getItemById(id),
      pointers: searchRes[id].map(el => el.pointer)
    })).filter(res => !!res.menuItem);

    this.items.sort((a, b) => {
      if (a.menuItem.depth > b.menuItem.depth) return 1;
      else if (a.menuItem.depth < b.menuItem.depth) return -1;
      else return 0;
    });
    this.marker.mark(val);
  }

  clickSearch(item) {
    this.search.ensureSearchVisible(
      item.pointers
    );
    this.marker.remark();
    this.menu.activate(item.menuItem.flatIdx);
    this.menu.scrollToActive();
  }

  ngOnInit() {
    this.init();
  }

  destroy() {
    this._subscription.unsubscribe();
  }
}
