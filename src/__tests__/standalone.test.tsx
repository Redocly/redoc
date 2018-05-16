/* tslint:disable:no-implicit-dependencies */
import { mount } from 'enzyme';
import * as React from 'react';
import * as yaml from 'yaml-js';

import { readFileSync } from 'fs';
import { resolve } from 'path';

// import { filterPropsDeep } from '../../../utils/test-utils';

import { ErrorBoundary, Loading, RedocStandalone, StoreProvider } from '../components/';

describe('Components', () => {
  describe('RedocStandalone', () => {
    test('should show loading first', () => {
      const spec = yaml.load(readFileSync(resolve(__dirname, '../../demo/openapi.yaml')));

      const inst = mount(<RedocStandalone spec={spec} options={{}} />);
      expect(inst.find(Loading)).toHaveLength(1);
    });
  });
});
