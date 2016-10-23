'use strict';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';

@Component({
  selector: 'security-definitions',
  styleUrls: ['./security-definitions.css'],
  templateUrl: './security-definitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityDefinitions extends BaseComponent implements OnInit {
  info: any = {};
  specUrl: String;
  message: string = 'Roman';
  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
  }

  ngOnInit() {
    this.preinit();
  }
}
