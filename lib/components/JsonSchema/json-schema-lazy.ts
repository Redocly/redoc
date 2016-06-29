'use strict';

import { Component, ElementRef, ViewContainerRef, OnDestroy, Input,
  AfterViewInit, ComponentResolver, Renderer } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { JsonSchema } from './json-schema';
import { OptionsService } from '../../services/options.service';
import { SpecManager } from '../../utils/SpecManager';

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
  @Input() final: boolean = false;
  @Input() nestOdd: boolean;
  @Input() childFor: string;
  @Input() isArray: boolean;
  loaded: boolean = false;
  constructor(private specMgr:SpecManager, private location:ViewContainerRef, private elementRef:ElementRef,
    private resolver:ComponentResolver, private optionsService:OptionsService, private _renderer: Renderer) {
  }

  normalizePointer() {
    let schema = this.specMgr.byPointer(this.pointer);
    return schema && schema.$ref || this.pointer;
  }

  _loadAfterSelf() {
    // FIXME: get rid of DynamicComponentLoader as it is deprecated
    return this.resolver.resolveComponent(JsonSchema).then(componentFactory => {
      let contextInjector = this.location.parentInjector;
      let compRef = this.location.createComponent(
          componentFactory, null, contextInjector, null);
      this.initComponent(compRef.instance);
      this._renderer.setElementAttribute(compRef.location.nativeElement, 'class', this.location.element.nativeElement.className);
      compRef.changeDetectorRef.detectChanges();
      return compRef;
    }).catch(err => {
      console.log(err);
      throw err;
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
          if (compRef.instance.hasDescendants || compRef.instance._hasSubSchemas) {
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

  initComponent(instance:JsonSchema) {
    Object.assign(instance, this);
  }

  ngAfterViewInit() {
    if (this.optionsService.options.disableLazySchemas) {
      this._loadAfterSelf();
      return;
    }
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
