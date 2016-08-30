'use strict';

import { Component, Input, Renderer, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { BaseComponent, SpecManager } from '../base';
import { SchemaNormalizer, SchemaHelper } from '../../services/index';

@Component({
  selector: 'json-schema',
  templateUrl: './json-schema.html',
  styleUrls: ['./json-schema.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  descendants: any;

  constructor(specMgr:SpecManager, private _renderer: Renderer, private _elementRef: ElementRef) {
    super(specMgr);
    this.normalizer = new SchemaNormalizer(specMgr);
  }

  get normPointer() {
    return this.schema._pointer || this.pointer;
  }

  selectDescendant(idx) {
    let activeDescendant = this.descendants[idx];
    if (!activeDescendant || activeDescendant.active) return;
    this.descendants.forEach(d => {
      d.active = false;
    });
    activeDescendant.active = true;

    this.pointer = activeDescendant.$ref;
    this.schema = this.specMgr.byPointer(this.pointer);
    this.schema = this.normalizer.normalize(this.schema, this.normPointer, {omitParent: false});
    this.preprocessSchema();
  }

  initDescendants() {
    this.descendants = this.specMgr.findDerivedDefinitions(this.normPointer);
    this.selectDescendant(0);
  }

  init() {
    if (!this.pointer) return;
    this.schema = this.componentSchema;
    if (!this.schema) {
      throw new Error(`Can't load component schema at ${this.pointer}`);
    }

    this.applyStyling();

    this.schema = this.normalizer.normalize(this.schema, this.normPointer);
    this.initDescendants();
    this.schema = SchemaHelper.unwrapArray(this.schema, this.normPointer);
    this.preprocessSchema();
  }

  preprocessSchema() {
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

    this._hasSubSchemas = this.properties && this.properties.some(
      propSchema => {
        if (propSchema.type === 'array') {
          propSchema = propSchema.items;
        }
        return (propSchema && propSchema.type === 'object' && propSchema._pointer);
      });

    this.autoExpand = this.properties && this.properties.length === 1;
  }

  applyStyling() {
    if (this.nestOdd) {
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'nestodd', 'true');
    }
  }

  trackByName(index: number, item: any): number {
    return item.name;
  }

  ngOnInit() {
    this.preinit();
  }
}
