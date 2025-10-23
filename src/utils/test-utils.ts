/* tslint:disable:no-implicit-dependencies */

import { objectHas, objectSet } from './object.js';

function traverseComponent(root, fn) {
  if (!root) {
    return;
  }

  fn(root);

  if (root.children) {
    for (const child of root.children) {
      traverseComponent(child, fn);
    }
  }
}

export function filterPropsDeep<T extends GenericObject>(component: T, paths: string[]): T {
  traverseComponent(component, (comp) => {
    if (comp.props) {
      for (const path of paths) {
        if (objectHas(comp.props, path)) {
          objectSet(comp.props, path, '<<<filtered>>>');
        }
      }
    }
  });

  return component;
}
