'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {ElementRef} from 'angular2/angular2';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './lib/components/JsonSchema/json-schema.html',
  styleUrls: ['./lib/components/JsonSchema/json-schema.css'],
  directives: [JsonSchema]
})
export default class JsonSchema extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  prepareModel() {
    this.dereference();
    this.joinAllOf();
    this.requiredMap = {};
    if (this.schema.required) {
      this.schema.required.forEach(prop => this.requiredMap[prop] = true);
    }
    let schema = this.componentSchema;
    this.data = {};
    this.data.properties = [];
    if (schema.type !== 'object' && schema.type !== 'array') {
      // TODO
      this.errorMessage = 'Non-object and non-array schemas are not implemented yet';
      return;
    }

    if (schema.type === 'array') {
      this._isArray = true;
      this.pointer = schema.items._pointer || this.pointer;
      schema = schema.items;
    }

    if (schema.type === 'object') {
      this.pointer = schema._pointer || this.pointer;
    }


    if (!schema.properties) return;
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
      if (itemType === 'object') {
        itemType = propData.items.title || 'object';
        propData._pointer = this.pointer + '/properties/' + prop;
      }
      propData._displayType= `array of ${itemType}`;
      propData._isArray = true;
    }

    if (propData.type === 'object') {
      propData._displayType = propData.title || 'object';
    }
  }

  init() {
    setTimeout(() => this.adjustNameColumnWidth());
  }
}
JsonSchema.parameters = JsonSchema.parameters.concat([[ElementRef]]);
