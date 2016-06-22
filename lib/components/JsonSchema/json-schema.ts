'use strict';

import { Input } from '@angular/core';

import { RedocComponent, BaseComponent, SpecManager } from '../base';
import { DropDown } from '../../shared/components/index';
import { SchemaNormalizer, SchemaHelper } from '../../services/index';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './json-schema.html',
  styleUrls: ['./json-schema.css'],
  directives: [JsonSchema, DropDown],
  detect: true
})
export class JsonSchema extends BaseComponent {
  schema: any;
  activeDescendant:any = {};
  hasDescendants: boolean = false;
  @Input() isArray: boolean;
  @Input() final: boolean = false;
  @Input() nestOdd: boolean;
  @Input() childFor: string;
  @Input() isRequestSchema: boolean;
  normalizer: SchemaNormalizer;

  constructor(schemaMgr:SpecManager) {
    super(schemaMgr);
    this.normalizer = new SchemaNormalizer(schemaMgr);
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

      this.schema._derived.sort((a, b) => {
        return enumOrder[a.name] > enumOrder[b.name] ? 1 : -1;
      });
    }
    this.selectDescendant(0);
  }

  prepareModel() {
    let schema = this.schema = this.componentSchema;
    if (!schema) {
      throw new Error(`Can't load component schema at ${this.pointer}`);
    }

    schema = this.normalizer.normalize(schema, this.normPointer);
    this.schema = schema = SchemaHelper.unwrapArray(schema, this.normPointer);
    SchemaHelper.preprocess(schema, schema, this.normPointer, this.pointer);

    if (!schema.isTrivial) {
      SchemaHelper.preprocessProperties(schema, this.normPointer, {
        childFor: this.childFor,
        skipReadOnly: this.isRequestSchema
      });
    }

    this.initDescendants();
  }
}
