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
    this.requiredMap = {};
    if (this.schema.required) {
      this.schema.required.forEach(prop => this.requiredMap[prop] = true);
    }
    let schema = this.componentSchema;
    this.data = {};
    this.data.properties = [];
    if (schema.type !== 'object') {
      // TODO
      return;
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

    if (propData.type === 'array') {
      let itemType = propData.items.type;
      if (itemType === 'object') {
        itemType = propData.items.title || 'object';
        propData._pointer = propData.items._pointer;
      }
      propData.type = `array of ${itemType}`;
    }

    if (propData.type === 'object') {
      propData.type = propData.title || 'object';
    }
  }

  init() {
    setTimeout(() => this.adjustNameColumnWidth());
  }
}
JsonSchema.parameters = JsonSchema.parameters.concat([[ElementRef]]);
