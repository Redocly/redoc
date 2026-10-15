import { describe, expect, it } from 'vitest';

import {
  NESTED_MENU_MOTION_CSS,
  NESTED_MENU_PANEL_SELECTOR,
  isNestedMenuCollapsed,
  syncNestedMenuA11y,
} from '../nestedMenuMotion.js';

function panel(style: string): HTMLElement {
  const element = document.createElement('div');
  element.setAttribute('style', style);
  return element;
}

describe('nested menu motion', () => {
  it('treats a fully collapsed panel as hidden', () => {
    expect(isNestedMenuCollapsed(panel('display: none; height: 0px; overflow: hidden;'))).toBe(
      true,
    );
  });

  it('treats an in-progress height transition as visible', () => {
    const transitioning = panel(
      'display: block; overflow: hidden; height: 40px; transition: height 292ms cubic-bezier(0.4, 0, 0.2, 1);',
    );
    const expanded = panel('pointer-events: auto;');

    expect(isNestedMenuCollapsed(transitioning)).toBe(false);
    expect(isNestedMenuCollapsed(expanded)).toBe(false);
  });

  it('sets aria-hidden only on collapsed nested groups', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <ul data-component-name="Menu/Menu">
        <div data-component-name="Menu/MenuItem" class="menu-item-type-group">
          <a href="/docs/authorization">Authorization</a>
          <div style="display: none; height: 0px; overflow: hidden;">hidden child</div>
        </div>
        <div data-component-name="Menu/MenuItem" class="menu-item-type-group">
          <a href="/docs/products">Products</a>
          <div style="pointer-events: auto;">visible child</div>
        </div>
        <div data-component-name="Menu/MenuItem" class="menu-item-type-default">
          <a href="/docs">Overview</a>
        </div>
      </ul>
    `;

    syncNestedMenuA11y(root);
    syncNestedMenuA11y(root);

    const panels = root.querySelectorAll<HTMLElement>(NESTED_MENU_PANEL_SELECTOR);
    expect(panels[0].getAttribute('aria-hidden')).toBe('true');
    expect(panels[1].hasAttribute('aria-hidden')).toBe(false);
    expect(root.querySelector('ul')?.hasAttribute('role')).toBe(false);
  });

  it('clears aria-hidden once a nested group expands', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div data-component-name="Menu/MenuItem" class="menu-item-type-group">
        <div aria-hidden="true" style="display: block; height: 120px;">open child</div>
      </div>
    `;

    syncNestedMenuA11y(root);

    const nested = root.querySelector('div > div');
    expect(nested?.hasAttribute('aria-hidden')).toBe(false);
  });

  it('clamps the pre-measure frame and disables motion when requested', () => {
    expect(NESTED_MENU_MOTION_CSS).toContain("div[style='']");
    expect(NESTED_MENU_MOTION_CSS).toContain('height: 0 !important');
    expect(NESTED_MENU_MOTION_CSS).toContain('@media (prefers-reduced-motion: reduce)');
    expect(NESTED_MENU_MOTION_CSS).toContain('transition: none !important');
    expect(NESTED_MENU_MOTION_CSS).toContain('height: auto !important');
  });
});
