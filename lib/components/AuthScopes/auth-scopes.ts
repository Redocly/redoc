'use strict';
import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';
import { ComponentParser } from '../../services/component-parser.service';

@Component({
  selector: 'auth-scopes',
  templateUrl: './auth-scopes.html',
  styleUrls: ['./auth-scopes.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthScopes extends BaseComponent implements OnInit {
  @Input() pointer:string;

  public scopes: any;

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    let theScopes = this.specMgr.getOperationScopes(this.pointer);
    if (theScopes.length) {
        this.scopes = {scopes: theScopes}
    }
  }

  ngOnInit() {
    this.preinit();
  }
}
