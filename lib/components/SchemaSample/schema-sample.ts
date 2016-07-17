'use strict';

import { ElementRef, Input } from '@angular/core';

import * as OpenAPISampler from 'openapi-sampler';

import { RedocComponent, BaseComponent, SpecManager } from '../base';
import { JsonFormatter } from '../../utils/JsonFormatterPipe';
import { SchemaNormalizer } from '../../services/schema-normalizer.service';

import { CopyButton } from '../../shared/components/CopyButton/copy-button.directive';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './schema-sample.html',
  pipes: [JsonFormatter],
  directives: [CopyButton],
  styleUrls: ['./schema-sample.css']
})
export class SchemaSample extends BaseComponent {
  element: any;
  data: any;
  enableButtons: boolean = false;
  @Input() skipReadOnly:boolean;

  private _normalizer:SchemaNormalizer;

  constructor(specMgr:SpecManager, elementRef:ElementRef) {
    super(specMgr);
    this.element = elementRef.nativeElement;
    this._normalizer = new SchemaNormalizer(specMgr);
  }

  init() {
    this.bindEvents();
    this.data = {};

    let base:any = {};
    let sample;

    // got pointer not directly to the schema but e.g. to response obj
    if (this.componentSchema.schema) {
      base = this.componentSchema;
      this.componentSchema = this.componentSchema.schema;
    }

    if (base.examples && base.examples['application/json']) {
      sample = base.examples['application/json'];
    } else {
      let selectedDescendant;

      this.componentSchema = this._normalizer.normalize(this.componentSchema, this.pointer);

      let discriminator = this.componentSchema.discriminator;
      if (discriminator) {
        let descendants = this.specMgr.findDerivedDefinitions(this.componentSchema._pointer || this.pointer);
        if (descendants.length) {
          // TODO: sync up with dropdown
          selectedDescendant = descendants[0];
          let descSchema = this.specMgr.byPointer(selectedDescendant.$ref);
          this.componentSchema  = this._normalizer.normalize(Object.assign({}, descSchema), selectedDescendant.$ref,
            {omitParent: false});
        }
      }
      if (this.fromCache()) {
        this.initButtons();
        return;
      }
      try {
        sample = OpenAPISampler.sample(this.componentSchema, {
          skipReadOnly: this.skipReadOnly
        });
      } catch(e) {
        // no sample available
      }
      if (selectedDescendant) {
        sample[discriminator] = selectedDescendant.name;
      }
    }
    this.cache(sample);
    this.data.sample = sample;
    this.initButtons();
  }

  initButtons() {
    if (typeof this.data.sample === 'object') {
      this.enableButtons = true;
    }
  }

  cache(sample) {
    if (this.skipReadOnly) {
      this.componentSchema['x-redoc-ro-sample'] = sample;
    } else {
      this.componentSchema['x-redoc-rw-sample'] = sample;
    }
  }

  fromCache() {
    if (this.skipReadOnly && this.componentSchema['x-redoc-ro-sample']) {
      this.data.sample = this.componentSchema['x-redoc-ro-sample'];
      return true;
    } else if (this.componentSchema['x-redoc-rw-sample']) {
      this.data.sample = this.componentSchema['x-redoc-rw-sample'];
      return true;
    }
    return false;
  }

  bindEvents() {
    this.element.addEventListener('click', (event) => {
      var collapsed, target = event.target;
      if (event.target.className === 'collapser') {
        collapsed = target.parentNode.getElementsByClassName('collapsible')[0];
        if (collapsed.parentNode.classList.contains('collapsed')) {
          collapsed.parentNode.classList.remove('collapsed');
        } else {
          collapsed.parentNode.classList.add('collapsed');
        }
      }
    });
  }

  expandAll() {
    let elements = this.element.getElementsByClassName('collapsible');
    for (let i = 0; i < elements.length; i++) {
      let collapsed = elements[i];
      collapsed.parentNode.classList.remove('collapsed');
    }
  }

  collapseAll() {
    let elements = this.element.getElementsByClassName('collapsible');
    for (let i = 0; i < elements.length; i++) {
      let expanded = elements[i];
      if (expanded.parentNode.classList.contains('redoc-json')) continue;
      expanded.parentNode.classList.add('collapsed');
    }
  }
}
