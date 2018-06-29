'use strict';
import { Component, ChangeDetectionStrategy, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpecManager, BaseComponent } from '../base';
import { OptionsService, Marker } from '../../services/index';

@Component({
  selector: 'api-info',
  styleUrls: ['./api-info.css'],
  templateUrl: './api-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiInfo extends BaseComponent implements OnInit {
  info: any = {};
  specUrl: String | SafeResourceUrl;
  downloadFilename = '';

  hideDownloadButton = this.optionsService.options.hideDownloadButton;

  constructor(specMgr: SpecManager,
    private optionsService: OptionsService,
    elRef: ElementRef,
    marker: Marker,
    private sanitizer: DomSanitizer
  ) {
    super(specMgr);
    marker.addElement(elRef.nativeElement);
  }

  init() {
    this.info = this.componentSchema.info;
    this.specUrl = this.specMgr.specUrl;
    if (!this.specUrl && window.Blob && window.URL) {
      const blob = new Blob([JSON.stringify(this.specMgr.rawSpec, null, 2)], {type : 'application/json'});
      this.specUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.downloadFilename = 'swagger.json';
    }

    if (!isNaN(parseInt(this.info.version.toString().substring(0, 1)))) {
      this.info.version = 'v' + this.info.version;
    }
  }

  ngOnInit() {
    this.preinit();
  }
}
