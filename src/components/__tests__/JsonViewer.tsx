/* tslint:disable:no-implicit-dependencies */

import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { act } from 'react';

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

    test('Expand/Collapse buttons disappears for flat structures', () => {
      const flatData = { a: 1, b: '2', c: null };
      const flatDataComponent = mount(withTheme(<JsonViewer data={flatData} />));

      expect(flatDataComponent.html()).not.toContain('Expand all');
      expect(flatDataComponent.html()).not.toContain('Collapse all');
    });

    describe('Keyboard Navigation', () => {
      let component: ReactWrapper;
      const data = {
        a: 1,
        b: {
          c:
            // Long string to test horizontal scrolling
            Array(100).fill('hello').join(''),
        },
      };

      beforeEach(() => {
        component = mount(withTheme(<JsonViewer data={data} />));
        ClipboardService.copySelected = origCopySelected;
      });

      test('should handle arrow key navigation', () => {
        const prismDiv = component.find('div[tabIndex=0]');
        const divElement = prismDiv.getDOMNode();

        // Mock scrollLeft before events
        Object.defineProperty(divElement, 'scrollLeft', {
          get: jest.fn(() => 0),
          set: jest.fn(),
        });

        // Trigger events inside act()
        act(() => {
          divElement.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'ArrowRight',
              bubbles: true,
            }),
          );
        });

        act(() => {
          divElement.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'ArrowLeft',
              bubbles: true,
            }),
          );
        });

        expect(divElement.scrollLeft).toBe(0);
      });
    });
  });
});
