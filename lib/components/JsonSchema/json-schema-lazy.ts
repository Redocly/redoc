'use strict';

import { Component, ElementRef, ViewContainerRef, OnDestroy, Input,
  AfterViewInit, ComponentFactoryResolver, Renderer } from '@angular/core';

import { JsonSchema } from './json-schema';
import { OptionsService } from '../../services/options.service';
import { SpecManager } from '../../utils/SpecManager';

var cache = {};

@Component({
  selector: 'json-schema-lazy',
  entryComponents: [ JsonSchema ],
  template: ''
})
export class JsonSchemaLazy implements OnDestroy, AfterViewInit {
  @Input() pointer: string;
  @Input() auto: boolean;
  @Input() isRequestSchema: boolean;
  @Input() final: boolean = false;
  @Input() nestOdd: boolean;
  @Input() childFor: string;
  @Input() isArray: boolean;
  disableLazy: boolean = false;
  loaded: boolean = false;
  constructor(private specMgr:SpecManager, private location:ViewContainerRef, private elementRef:ElementRef,
    private resolver:ComponentFactoryResolver, private optionsService:OptionsService, private _renderer: Renderer) {
      this.disableLazy = this.optionsService.options.disableLazySchemas;
  }

  normalizePointer() {
    let schema = this.specMgr.byPointer(this.pointer);
    return schema && schema.$ref || this.pointer;
  }

  _loadAfterSelf() {
    var componentFactory = this.resolver.resolveComponentFactory(JsonSchema);
    let contextInjector = this.location.parentInjector;
    let compRef = this.location.createComponent(componentFactory, null, contextInjector, null);
    this.initComponent(compRef.instance);
    this._renderer.setElementAttribute(compRef.location.nativeElement, 'class', this.location.element.nativeElement.className);
    compRef.changeDetectorRef.detectChanges();
    this.loaded = true;
    return compRef;
  }

  load() {
    if (this.disableLazy) return;
    if (this.loaded) return;
    if (this.pointer) {
      this._loadAfterSelf();
    }
  }

  // cache JsonSchema view
  loadCached() {
    this.pointer = this.normalizePointer();
    if (cache[this.pointer]) {
      let compRef = cache[this.pointer];
      setTimeout( ()=> {
        let $element = compRef.location.nativeElement;

        // skip caching view with descendant schemas
        // as it needs attached controller
        if (!this.disableLazy && (compRef.instance.hasDescendants || compRef.instance._hasSubSchemas)) {
          this._loadAfterSelf();
          return;
        }
        insertAfter($element.cloneNode(true), this.elementRef.nativeElement);
        this.loaded = true;
      });
    } else {
      cache[this.pointer] = this._loadAfterSelf();
    }
  }

  initComponent(instance:JsonSchema) {
    Object.assign(instance, this);
  }

  ngAfterViewInit() {
    if (!this.auto && !this.disableLazy) return;
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
