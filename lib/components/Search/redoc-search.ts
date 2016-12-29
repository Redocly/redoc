'use strict';
import { Component, ChangeDetectionStrategy, OnInit, HostBinding } from '@angular/core';
import { Marker } from '../../services/';

@Component({
  selector: 'redoc-search',
  styleUrls: ['./redoc-search.css'],
  templateUrl: './redoc-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedocSearch implements OnInit {
  logo:any = {};

  constructor(private marker: Marker) {
  }

  init() {

  }

  update(val) {
    this.marker.mark(val);
  }

  ngOnInit() {

  }
}
