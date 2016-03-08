'use strict';

import {ElementRef} from 'angular2/core';

import {RedocComponent, BaseComponent, SchemaManager} from '../base';
import {Tabs, Tab} from '../../common/components/Tabs/tabs';
import JsonPointer from '../../utils/JsonPointer';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './lib/components/JsonSchema/json-schema.html',
  styleUrls: ['./lib/components/JsonSchema/json-schema.css'],
  directives: [JsonSchema, Tabs, Tab],
  inputs: ['isArray', 'final']
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef]])
export default class JsonSchema extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.$element = elementRef.nativeElement;
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
    if (this.componentSchema.required) {
      this.componentSchema.required.forEach(prop => this.requiredMap[prop] = true);
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
      let propPointer = JsonPointer.join(this.pointer, ['properties', prop]);
      propData = JsonSchema.injectPropData(propData, prop, propPointer, this.requiredMap, schema);
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

  static injectPropData(propData, propName, propPointer, requiredMap, schema) {
    let propEnum;

    propData = Object.assign({}, propData);
    propData._name = propName;
    propData.required = propData.required || (requiredMap && requiredMap[propName]);
    propData._displayType = propData.type;
    propData.isDiscriminator = (schema && schema.discriminator === propName);
    propEnum = propData.enum;
    if (propData.type === 'array') {
      let itemType = propData.items.type;
      let itemFormat = propData.items.format;
      propEnum = propData.items.enum;
      if (itemType === 'object' || !itemType) {
        itemType = propData.items.title || 'object';
        propData._pointer = propData.items._pointer
          || JsonPointer.join(propPointer, ['items']);
      }
      propData._displayType = `${itemType}`;
      propData.format = itemFormat;
      propData._isArray = true;
      propData.type = 'array ' + propData.items.type;
    } else if (propData.type === 'object') {
      propData._displayType = propData.title || 'object';
    } else if (!propData.type) {
      propData._displayType = '< * >';
      propData._displayTypeHint = 'This field may contain data of any type';
    } else {
      // here we are sure that property has simple type
      // delete pointer for simple types to not show it as subschema
      if (propData._pointer) {
        propData._pointer = undefined;
        propData._displayType = propData.title ? `${propData.title} (${propData.type})` : propData.type;
      }
    }

    if (propData.format) propData._displayFormat = `<${propData.format}>`;
    if (propEnum) {
      propData.enum = propEnum.map((value) => {
        return {val: value, type: typeof value};
      });
    }

    return propData;
  }

  ngAfterViewInit() {
    // adjust widht only on parent level
    let $el = this.$element.parentElement;
    while($el && $el.tagName !== 'JSON-SCHEMA' && $el.tagName !== 'REDOC') {
      $el = $el.parentElement;
    }
    if ($el && $el.tagName === 'REDOC' ) {
      this.adjustNameColumnWidth();
    }
  }

  adjustNameColumnWidth() {
    // TODO handle internal schemes differently

    let names = [].slice.call(this.$element.querySelectorAll('.param-name-content'));
    let widths = names.map(el => el.offsetWidth);
    let maxWidth = Math.max(...widths);
    if (!maxWidth) return;
    names.forEach(el => {
      el.parentNode.style.minWidth = maxWidth + 'px';
    });

    let discrValues = this.$element.querySelector('tabs ul');
    if (discrValues) discrValues.style.paddingLeft = maxWidth + 'px';
  }
}
