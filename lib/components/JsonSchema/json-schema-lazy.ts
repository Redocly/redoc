'use strict';

import { Component, ElementRef, ViewContainerRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { DynamicComponentLoader, Input } from '@angular/core';

import { JsonSchema } from './json-schema';
import { OptionsService } from '../../services/options.service';
import { SchemaManager } from '../../utils/SchemaManager';


var cache = {};


@Component({
  selector: 'json-schema-lazy',
  template: '',
  directives: [CORE_DIRECTIVES]
})
export class JsonSchemaLazy implements OnDestroy, AfterViewInit {
  @Input() pointer: string;
  @Input() auto: boolean;
  @Input() isRequestSchema: boolean;
  loaded: boolean = false;
  constructor(private schemaMgr:SchemaManager, private viewRef:ViewContainerRef, private elementRef:ElementRef,
    private dcl:DynamicComponentLoader, private optionsService:OptionsService) {
  }

  normalizePointer() {
    let schema = this.schemaMgr.byPointer(this.pointer);
    return schema && schema.$ref || this.pointer;
  }

  _loadAfterSelf() {
    // FIXME: get rid of DynamicComponentLoader as it is deprecated
    return this.dcl.loadNextToLocation(JsonSchema, this.viewRef).then((compRef) => {
      this.initComponent(compRef);
      if (compRef.changeDetectorRef) {
        compRef.changeDetectorRef.detectChanges();
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
    this.pointer = this.normalizePointer();
    if (cache[this.pointer]) {
      cache[this.pointer].then((compRef) => {
        setTimeout( ()=> {
          let $element = compRef.location.nativeElement;

          // skip caching view with tabs inside (discriminator)
          // as it needs attached controller
          if (compRef.instance.hasDiscriminator) {
            this._loadAfterSelf();
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
