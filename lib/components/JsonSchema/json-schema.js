'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {Tabs, Tab} from '../../common/components/Tabs/tabs';
import {ElementRef} from 'angular2/core';
import JsonPointer from '../../utils/JsonPointer';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './lib/components/JsonSchema/json-schema.html',
  styleUrls: ['./lib/components/JsonSchema/json-schema.css'],
  directives: [JsonSchema, Tabs, Tab],
  inputs: ['isArray', 'final']
})
export default class JsonSchema extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
    this.final = false;
  }

  prepareModel() {
    this.data = {};
    this.data.properties = [];
    this.data.derived = [];

    if (!this.componentSchema) {
      throw new Error(`Can't load component schema at ${this.pointer}`);
    }

    this.dereference();
    let schema = this.componentSchema;

    if (schema.type === 'array') {
      this.isArray = true;
      if (schema._pointer) {
        this.pointer = JsonPointer.join(schema._pointer, 'items');
      }
      schema = schema.items;
    }
    let normPtr = schema._pointer || this.pointer;
    let derived = this.schemaMgr.findDerivedDefinitions( normPtr );
    if (!this.final && derived.length) {
      this.data.derived = derived;
      this.data.discriminator = schema.discriminator;
    }

    this.joinAllOf(schema, {omitParent: true});

    if (schema.type !== 'object') {
      this.isTrivial = true;
      this._displayType = schema.type;
      if (schema.format) this._displayType = `${this.displayType} <${schema.format}>`;
      return;
    }

    this.pointer = schema._pointer || this.pointer;

    this.requiredMap = {};
    if (this.schema.required) {
      this.schema.required.forEach(prop => this.requiredMap[prop] = true);
    }

    if (!schema.properties) {
      this.isTrivial = true;
      this._displayType = schema.type;
      this._displayTypeHint = 'This field may contain data of any type';
      return;
    }

    let discriminatorFieldIdx = -1;
    let props = Object.keys(schema.properties).map((prop, idx) => {
      let propData = schema.properties[prop];
      this.injectPropData(prop, propData, schema);
      if (propData.isDiscriminator) discriminatorFieldIdx = idx;
      return propData;
    });
    // Move discriminator field to the end of properties list
    if (discriminatorFieldIdx > -1) {
      let discrProp = props.splice(discriminatorFieldIdx, 1);
      props.push(discrProp[0]);
    }
    this.data.properties = props;
  }

  adjustNameColumnWidth() {
    // TODO handle internal schemes differently
    let names = [].slice.call(this.element.querySelectorAll('.param-name'));
    let widths = names.map(el => el.offsetWidth);
    let maxWidth = Math.max(...widths);
    if (!maxWidth) return;
    names.forEach(el => {
      el.style.minWidth = maxWidth + 'px';
    });

    let discrValues = this.element.querySelector('tabs ul');
    if (discrValues) discrValues.style.paddingLeft = maxWidth + 'px';
  }

  injectPropData(prop, propData, schema) {
    propData._name = prop;
    propData.isRequired = this.requiredMap[prop];
    propData._displayType = propData.type;
    propData.isDiscriminator = (schema.discriminator === prop);
    if (propData.type === 'array') {
      let itemType = propData.items.type;
      let itemFormat = propData.items.format;
      if (itemType === 'object' || !itemType) {
        itemType = propData.items.title || 'object';
        propData._pointer = propData.items._pointer || JsonPointer.join(this.pointer, ['properties', prop, 'items']);
      }
      propData._displayType = `array of ${itemType}`;
      propData.format = itemFormat;
      propData._isArray = true;
    }

    if (propData.type === 'object') {
      propData._displayType = propData.title || 'object';
    }

    if (!propData.type) {
      propData._displayType = '< * >';
      propData._displayTypeHint = 'This field may contain data of any type';
    }

    if (propData.format) propData._displayFormat = `<${propData.format}>`;
  }

  init() {
    setTimeout(() => this.adjustNameColumnWidth());
  }
}
JsonSchema.parameters = JsonSchema.parameters.concat([[ElementRef]]);
