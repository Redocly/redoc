'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {ElementRef} from 'angular2/angular2';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './lib/components/JsonSchema/json-schema.html',
  styleUrls: ['./lib/components/JsonSchema/json-schema.css'],
  directives: [JsonSchema],
  inputs: ['isArray']
})
export default class JsonSchema extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  prepareModel() {
    this.data = {};
    this.data.properties = [];

    if (!this.componentSchema) {
      // TODO
      this.errorMessage = 'Can\'t load component schema';
      console.warn(`${this.errorMessage}: ${this.pointer}`);
      return;
    }

    this.dereference();
    let schema = this.componentSchema;

    if (schema.type === 'array') {
      this.isArray = true;
      schema = schema.items;
    }
    this.joinAllOf(schema);

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
      this._displayType = `${schema.type} (Custom key-value pairs)`;
      return;
    }
    let props = Object.keys(schema.properties).map(prop => {
      let propData = schema.properties[prop];
      this.injectPropData(prop, propData);
      return propData;
    });
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
  }

  injectPropData(prop, propData) {
    propData._name = prop;
    propData.isRequired = this.requiredMap[prop];
    propData._displayType = propData.type;
    if (propData.type === 'array') {
      let itemType = propData.items.type;
      let itemFormat = propData.items.format;
      if (itemType === 'object') {
        itemType = propData.items.title || 'object';
        propData._pointer = propData.items._pointer || this.pointer + '/properties/' + prop + '/items';
      }
      propData._displayType = `array of ${itemType}`;
      propData.format = itemFormat;
      propData._isArray = true;
    }

    if (propData.type === 'object') {
      propData._displayType = propData.title || 'object';
    }

    if (propData.format) propData._displayFormat = `<${propData.format}>`;
  }

  init() {
    setTimeout(() => this.adjustNameColumnWidth());
  }
}
JsonSchema.parameters = JsonSchema.parameters.concat([[ElementRef]]);
