'use strict';

import {Component, ElementRef} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {DynamicComponentLoader} from 'angular2/src/core/linker/dynamic_component_loader';

import JsonSchema from './json-schema';
import OptionsManager from '../../options';
import SchemaManager from '../../utils/SchemaManager';


var cache = {};


@Component({
  selector: 'json-schema-lazy',
  inputs: ['pointer', 'auto', 'skipReadOnly'],
  template: '',
  directives: [CORE_DIRECTIVES]
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef], [DynamicComponentLoader], [OptionsManager]])
export default class JsonSchemaLazy {

  constructor(schemaMgr, elementRef, dcl, optionsMgr) {
    this.elementRef = elementRef;
    this.dcl = dcl;
    this.optionsMgr = optionsMgr;
    this.schemaMgr = schemaMgr;
  }

  normalizePointer() {
    let schema = this.schemaMgr.byPointer(this.pointer);
    return schema && schema.$ref || this.pointer;
  }

  load() {
    if (this.optionsMgr.options.disableLazySchemas) return;
    if (this.loaded) return;
    if (this.pointer) {
      this.dcl.loadNextToLocation(JsonSchema, this.elementRef).then((compRef) => {
        this.initComponent(compRef);
        // trigger change detection
        compRef.hostView.changeDetectorRef.detectChanges();
      });
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
            this.dcl.loadNextToLocation(JsonSchema, this.elementRef).then((compRef) => {
              this.initComponent(compRef);
              compRef.hostView.changeDetectorRef.markForCheck();
            });
            return;
          }
          insertAfter($element.cloneNode(true), this.elementRef.nativeElement);
        } );
      });
    } else {
      cache[this.pointer] = this.dcl.loadNextToLocation(JsonSchema, this.elementRef).then((compRef) => {
        this.initComponent(compRef);
        compRef.hostView.changeDetectorRef.markForCheck();
        return compRef;
      });
    }
  }

  initComponent(compRef) {
    compRef.instance.pointer = this.pointer;
    compRef.instance.skipReadOnly = this.skipReadOnly;
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
