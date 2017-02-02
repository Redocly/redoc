'use strict';
import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';

@Component({
  selector: 'redoc-externalDocs',
  template: `<a *ngIf="docs" [href]="docs.url" [innerHtml]="docs.description | marked"></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalDocs implements OnInit {
  @Input() docs;

  ngOnInit() {
    if (this.docs && !this.docs.description) {
      this.docs.description = 'External Docs';
    }
  }
}
