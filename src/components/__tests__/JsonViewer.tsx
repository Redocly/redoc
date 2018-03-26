import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

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
      expect(component.html()).not.toContain('class="hoverable"'); // all are collapesed by default
      const expandAll = component.find('div > span[children=" Expand all "]');
      expandAll.simulate('click');
      expect(component.html()).toContain('class="hoverable"'); // all are collapesed

      const collapseAll = component.find('div > span[children=" Collapse all "]');
      collapseAll.simulate('click');
      expect(component.html()).not.toContain('class="hoverable"'); // all are collapesed
    });

    test('should collapse/uncollapse', () => {
      ClipboardService.copySelected = jest.fn();

      const copy = component.find('span[onClick]').first();
      copy.simulate('click');

      expect(ClipboardService.copySelected as jest.Mock).toHaveBeenCalled();
    });
  });
});
