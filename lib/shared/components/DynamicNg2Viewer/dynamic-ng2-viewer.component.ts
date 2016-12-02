'use strict';

import {
  Component,
  Input,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  Renderer
} from '@angular/core';

import {
  ComponentParser,
  ContentProjector
} from '../../../services/';

@Component({
  selector: 'dynamic-ng2-viewer',
  template: ''
})
export class DynamicNg2Viewer implements OnInit {
  @Input() html: string;

  constructor(
    private view: ViewContainerRef,
    private projector: ContentProjector,
    private parser: ComponentParser,
    private resolver: ComponentFactoryResolver,
    private renderer: Renderer) {
  }

  ngOnInit() {
    this.parser.setRenderer(this.renderer);
    let nodesOrComponents = this.parser.splitIntoNodesOrComponents(this.html, this.view.injector);
    let wrapperFactory = this.resolver.resolveComponentFactory(DynamicNg2Wrapper);
    let ref = this.projector.instantiateAndProject(wrapperFactory, this.view, nodesOrComponents);
    ref.changeDetectorRef.markForCheck();
  }
}

@Component({
  selector: 'dynamic-ng2-wrapper',
  template: '<ng-content></ng-content>'
})
export class DynamicNg2Wrapper {}
