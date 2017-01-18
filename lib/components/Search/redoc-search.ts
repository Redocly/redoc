'use strict';
import { Component, ChangeDetectionStrategy, OnInit, HostBinding } from '@angular/core';
import { Marker, SearchService } from '../../services/';

@Component({
  selector: 'redoc-search',
  styleUrls: ['./redoc-search.css'],
  templateUrl: './redoc-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedocSearch implements OnInit {
  logo:any = {};

  constructor(private marker: Marker, public search: SearchService) {
  }

  init() {

  }

  update(val) {
    this.marker.mark(val);
  }

  tmpSearch() {
    this.search.ensureSearchVisible([
      '/paths/~1pet~1findByStatus/get/responses/200/schema/items/properties/category/properties/sub',
      '/paths/~1pet~1findByStatus/get/responses/200/schema/items/properties/tags',
      '/paths/~1pet/post/parameters/0/schema/properties/tags'
    ]);
  }

  ngOnInit() {

  }
}
