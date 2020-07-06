/* tslint:disable:no-implicit-dependencies */

import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { JsonViewer } from '../';
import { withTheme } from '../testProviders';

import { ClipboardService } from '../../services/ClipboardService';

const origCopySelected = ClipboardService.copySelected;

describe('Components', () => {
  describe('JsonViewer', () => {
    let component: ReactWrapper;
    const data = { a: 1, b: { c: 'hello' } };
    beforeEach(() => {
      component = mount(withTheme(<JsonViewer data={data} />));
      ClipboardService.copySelected = origCopySelected;
    });

    test('should render inner HTML', () => {
      expect(component.html()).toContain('class="redoc-json"');
    });

    test('should collapse/uncollapse', () => {
      expect(component.html()).not.toContain('class="hoverable"'); // all are collapsed by default
      const expandAll = component.find('div > button[children=" Expand all "]');
      expandAll.simulate('click');
      expect(component.html()).toContain('class="hoverable"'); // all are collapsed

      const collapseAll = component.find('div > button[children=" Collapse all "]');
      collapseAll.simulate('click');
      expect(component.html()).not.toContain('class="hoverable"'); // all are collapsed
    });

    test('should collapse/uncollapse', () => {
      ClipboardService.copySelected = jest.fn();

      const copy = component.find('button[onClick]').first();
      copy.simulate('click');

      expect(ClipboardService.copySelected as jest.Mock).toHaveBeenCalled();
    });
  });
});
