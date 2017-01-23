'use strict';
import { Component, ChangeDetectionStrategy, OnInit, HostBinding } from '@angular/core';
import { Marker, SearchService, MenuService } from '../../services/';

@Component({
  selector: 'redoc-search',
  styleUrls: ['./redoc-search.css'],
  templateUrl: './redoc-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedocSearch implements OnInit {
  logo:any = {};
  items: any[] = [];

  constructor(private marker: Marker, public search: SearchService, public menu: MenuService) {
  }

  init() {
    this.search.indexAll();
  }

  update(val) {
    let searchRes = this.search.search(val);
    this.items = Object.keys(searchRes).map(id => ({
      menuItem: this.menu.getItemById(id),
      pointers: searchRes[id].map(el => el.pointer)
    }));
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
}
