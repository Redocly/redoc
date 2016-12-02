'use strict';

import {
  Injectable,
  ComponentFactory,
  ComponentRef,
  ViewContainerRef
} from '@angular/core';

@Injectable()
export class ContentProjector {
  instantiateAndProject<T>(componentFactory: ComponentFactory<T>,
  parentView:ViewContainerRef, projectedNodesOrComponents: any[]):ComponentRef<T> {
    let contextInjector = parentView.parentInjector;

    let projectedNodes = [];
    let componentRefs:ComponentRef<any>[] = [];

    for (let i=0; i < projectedNodesOrComponents.length; i++) {
      let nodeOrCompRef = projectedNodesOrComponents[i];
      if (nodeOrCompRef instanceof ComponentRef) {
        projectedNodes.push(nodeOrCompRef.location.nativeElement);
        componentRefs.push(nodeOrCompRef);
      } else {
        projectedNodes.push(nodeOrCompRef);
      }
    }

    let parentCompRef = parentView.createComponent(componentFactory, null, contextInjector, [projectedNodes]);

    // using private property to get AppElement instance
    let viewContainer = (<any>parentView)._element;
    viewContainer.nestedViews = viewContainer.nestedViews || [];
    for (let i=0; i < componentRefs.length; i++) {
      let compRef = componentRefs[i];
      // attach view to viewContainer change detector
      viewContainer.nestedViews.push((<any>compRef.hostView).internalView);
      (<any>compRef.hostView).internalView.viewContainer = viewContainer;
    }
    return parentCompRef;
  }
}
