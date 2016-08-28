'use strict';

import { Component, Input, Renderer, ElementRef, OnInit } from '@angular/core';

import { BaseComponent, SpecManager } from '../base';
import { SchemaNormalizer, SchemaHelper } from '../../services/index';

@Component({
  selector: 'json-schema',
  templateUrl: './json-schema.html',
  styleUrls: ['./json-schema.css']
})
export class JsonSchema extends BaseComponent implements OnInit {
  @Input() pointer: string;
  @Input() final: boolean = false;
  @Input() nestOdd: boolean;
  @Input() childFor: string;
  @Input() isRequestSchema: boolean;

  schema: any = {};
  activeDescendant:any = {};
  hasDescendants: boolean = false;
  _hasSubSchemas: boolean = false;
  properties: any;
  _isArray: boolean;
  normalizer: SchemaNormalizer;
  autoExpand = false;

  constructor(specMgr:SpecManager, private _renderer: Renderer, private _elementRef: ElementRef) {
    super(specMgr);
    this.normalizer = new SchemaNormalizer(specMgr);
  }

  get normPointer() {
    return this.schema._pointer || this.pointer;
  }

  selectDescendant(idx) {
    let activeDescendant = this.schema._descendants[idx];
    if (!activeDescendant || activeDescendant.active) return;
    this.schema._descendants.forEach(subSchema => {
      subSchema.active = false;
    });
    activeDescendant.active = true;
    this.activeDescendant = activeDescendant;
  }

  initDescendants() {
    if (!this.schema._descendants || !this.schema._descendants.length) {
      return;
    }
    this.hasDescendants = true;
    let enumArr = this.schema._properties[this.schema._properties.length - 1].enum;
    if (enumArr) {
      let enumOrder = {};
      enumArr.forEach((enumItem, idx) => {
        enumOrder[enumItem.val] = idx;
      });

      this.schema._descendants.sort((a, b) => {
        return enumOrder[a.name] > enumOrder[b.name] ? 1 : -1;
      });
    }
    this.selectDescendant(0);
  }

  init() {
    if (!this.pointer) return;
    if (this.nestOdd) {
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'nestodd', 'true');
    }
    this.schema = this.componentSchema;
    if (!this.schema) {
      throw new Error(`Can't load component schema at ${this.pointer}`);
    }

    this.schema = this.normalizer.normalize(this.schema, this.normPointer);
    this.schema = SchemaHelper.unwrapArray(this.schema, this.normPointer);
    SchemaHelper.preprocess(this.schema, this.normPointer, this.pointer);

    if (!this.schema.isTrivial) {
      SchemaHelper.preprocessProperties(this.schema, this.normPointer, {
        childFor: this.childFor
      });
    }

    this.properties = this.schema._properties;
    if (this.isRequestSchema) {
      this.properties = this.properties && this.properties.filter(prop => !prop.readOnly);
    }

    this.initDescendants();
    this._hasSubSchemas = this.properties && this.properties.some(
      propSchema => {
        if (propSchema.type === 'array') {
          propSchema = propSchema.items;
        }
        return (propSchema && propSchema.type === 'object' && propSchema._pointer);
      });

    this.autoExpand = this.properties && this.properties.length === 1;
  }

  trackByIdx(index: number, item: any): number {
    return index;
  }

  ngOnInit() {
    this.preinit();
  }
}
