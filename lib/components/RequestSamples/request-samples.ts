'use strict';

import { Component, ViewChildren, QueryList, Input,
 ChangeDetectionStrategy, OnInit, HostBinding, ElementRef, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs } from '../../shared/components/index';
import { AppStateService, ScrollService } from '../../services/index';

@Component({
  selector: 'request-samples',
  templateUrl: './request-samples.html',
  styleUrls: ['./request-samples.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestSamples extends BaseComponent implements OnInit {
  @Input() pointer:string;
  @Input() schemaPointer:string;
  @ViewChildren(Tabs) childQuery:QueryList<Tabs>;
  @HostBinding('attr.hidden') hidden;

  childTabs: Tabs;
  selectedLang: Subject<any>;
  samples: Array<any>;

  constructor(
    specMgr:SpecManager,
    public appState:AppStateService,
    private scrollService: ScrollService,
    private el: ElementRef,
    private zone: NgZone
  ) {
    super(specMgr);

    this.selectedLang = this.appState.samplesLanguage;
  }

  changeLangNotify(lang) {
    let relativeScrollPos = this.scrollService.relativeScrollPos(this.el.nativeElement);
    this.selectedLang.next(lang);
    // do scroll in the end of VM turn to have it seamless
    let subscription = this.zone.onMicrotaskEmpty.subscribe(() => {
      this.scrollService.scrollTo(this.el.nativeElement, relativeScrollPos);
      subscription.unsubscribe();
    });
  }

  init() {
    this.schemaPointer = this.schemaPointer ? JsonPointer.join(this.schemaPointer, 'schema') : null;
    this.samples = this.componentSchema['x-code-samples'] || [];
    if (!this.schemaPointer && !this.samples.length) this.hidden = true;
  }

  ngOnInit() {
    this.preinit();
  }
}
