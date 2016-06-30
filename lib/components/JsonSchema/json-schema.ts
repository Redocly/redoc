'use strict';

import { Input, Renderer, ElementRef, forwardRef } from '@angular/core';

import { RedocComponent, BaseComponent, SpecManager } from '../base';
import { DropDown } from '../../shared/components/index';
import { SchemaNormalizer, SchemaHelper } from '../../services/index';
import { JsonSchemaLazy } from './json-schema-lazy';
import { Zippy } from '../../shared/components/Zippy/zippy';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './json-schema.html',
  styleUrls: ['./json-schema.css'],
  directives: [JsonSchema, DropDown, forwardRef(() => JsonSchemaLazy), Zippy],
  detect: true
})
export class JsonSchema extends BaseComponent {
  schema: any;
  activeDescendant:any = {};
  hasDescendants: boolean = false;
  _hasSubSchemas: boolean = false;
  properties: any;
  _isArray: boolean;
  @Input() isArray: boolean;
  @Input() final: boolean = false;
  @Input() nestOdd: boolean;
  @Input() childFor: string;
  @Input() isRequestSchema: boolean;
  normalizer: SchemaNormalizer;

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

  prepareModel() {
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
    this._isArray = this.isArray || this.schema._isArray;
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
  }

  trackByIdx(index: number, item: any): number {
    return index;
  }
}
