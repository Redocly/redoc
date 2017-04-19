'use strict';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, HostBinding } from '@angular/core';
import { Marker, SearchService, MenuService, MenuItem } from '../../services/';
import { throttle } from '../../utils/';

@Component({
  selector: 'redoc-search',
  styleUrls: ['./redoc-search.css'],
  templateUrl: './redoc-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedocSearch implements OnInit {
  logo:any = {};
  items: { menuItem: MenuItem, pointers: string[] }[] = [];
  searchTerm = '';
  throttledSearch: Function;

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

    this.throttledSearch = throttle(() => {
      this.updateSearch();
      cdr.markForCheck();
      cdr.detectChanges();
    }, 300, this);
  }

  init() {
    this.search.indexAll();
  }

  update(event:KeyboardEvent, val) {
    if (event && event.keyCode === 27) { // escape
      this.searchTerm = '';
    } else {
      this.searchTerm = val;
    }

    this.throttledSearch();
  }

  updateSearch() {
    if (!this.searchTerm || this.searchTerm.length < 2) {
      this.items = [];
      this.marker.unmark();
      return;
    }

    let searchRes = this.search.search(this.searchTerm);
    this.items = Object.keys(searchRes).map(id => ({
      menuItem: this.menu.getItemById(id),
      pointers: searchRes[id].map(el => el.pointer)
    })).filter(res => !!res.menuItem);

    this.items.sort((a, b) => {
      if (a.menuItem.depth > b.menuItem.depth) return 1;
      else if (a.menuItem.depth < b.menuItem.depth) return -1;
      else return 0;
    });
    this.marker.mark(this.searchTerm);
  }

  clickSearch(item) {
    this.search.ensureSearchVisible(
      item.pointers
    );
    this.marker.remark();
    this.menu.activate(item.menuItem);
    this.menu.scrollToActive();
  }

  ngOnInit() {
    this.init();
  }

  destroy() {
    this._subscription.unsubscribe();
  }
}
