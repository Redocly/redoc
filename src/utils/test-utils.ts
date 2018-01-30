import { instanceOf } from 'prop-types';
import { RedocNormalizedOptions } from '../services/RedocNormalizedOptions';
import { set, has } from 'lodash';

function traverseComponent(root, fn) {
  if (!root) return;

  fn(root);

  if (root.children) {
    for (let child of root.children) {
      traverseComponent(child, fn);
    }
  }
}

export function filterPropsDeep<T extends Object>(component: T, paths: string[]): T {
  traverseComponent(component, comp => {
    if (comp.props) {
      for (const path of paths) {
        if (has(comp.props, path)) {
          set(comp.props, path, '<<<filtered>>>');
        }
      }
    }
  });

  return component;
}
