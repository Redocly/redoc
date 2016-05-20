'use strict';

import { Component, ElementRef, ViewContainerRef } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { DynamicComponentLoader } from '@angular/core';

import { JsonSchema } from './json-schema';
import { OptionsService } from '../../services/index';
import SchemaManager from '../../utils/SchemaManager';


var cache = {};


@Component({
  selector: 'json-schema-lazy',
  inputs: ['pointer', 'auto', 'isRequestSchema'],
  template: '',
  directives: [CORE_DIRECTIVES]
})
@Reflect.metadata('parameters', [[SchemaManager], [ViewContainerRef], [
  ElementRef], [DynamicComponentLoader], [OptionsService]])
export class JsonSchemaLazy {

  constructor(schemaMgr, viewRef, elementRef, dcl, optionsService) {
    this.viewRef = viewRef;
    this.elementRef = elementRef;
    this.dcl = dcl;
    this.optionsService = optionsService;
    this.schemaMgr = schemaMgr;
  }

  normalizePointer() {
    let schema = this.schemaMgr.byPointer(this.pointer);
    return schema && schema.$ref || this.pointer;
  }

  _loadAfterSelf() {
    return this.dcl.loadNextToLocation(JsonSchema, this.viewRef).then((compRef) => {
      this.initComponent(compRef);
      if (compRef.changeDetectorRef) {
        compRef.changeDetectorRef.detectChanges();
      } else {
        compRef.hostView.changeDetectorRef.detectChanges();
      }
      return compRef;
    });
  }

  load() {
    if (this.optionsService.options.disableLazySchemas) return;
    if (this.loaded) return;
    if (this.pointer) {
      this._loadAfterSelf();
    }
    this.loaded = true;
  }

  // cache JsonSchema view
  loadCached() {
    this.pointer = this.normalizePointer(this.pointer);
    if (cache[this.pointer]) {
      cache[this.pointer].then((compRef) => {
        setTimeout( ()=> {
          let $element = compRef.location.nativeElement;

          // skip caching view with tabs inside (discriminator) as it needs attached controller
          // FIXME: get rid of dependency on selector
          if ($element.querySelector('.discriminator-wrap')) {
            return;
          }
          insertAfter($element.cloneNode(true), this.elementRef.nativeElement);
        } );
      });
    } else {
      cache[this.pointer] = this._loadAfterSelf();
    }
  }

  initComponent(compRef) {
    compRef.instance.pointer = this.pointer;
    compRef.instance.isRequestSchema = this.isRequestSchema;
  }

  ngAfterViewInit() {
    if (!this.auto) return;
    this.loadCached();
  }

  ngOnDestroy() {
    // clear cache
    cache = {};
  }
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
