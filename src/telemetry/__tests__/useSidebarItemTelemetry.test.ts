import { describe, expect, it } from 'vitest';

import { sidebarItemFromTarget } from '../useSidebarItemTelemetry.js';

function menuItem(type: 'default' | 'group' | 'drilldown', withLink: boolean): HTMLElement {
  const item = document.createElement('div');
  item.setAttribute('data-component-name', 'Menu/MenuItem');
  item.className = `menu-item-type-${type}`;
  const label = document.createElement('li');
  label.setAttribute('data-testid', 'menu-item-label');
  if (withLink) {
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.appendChild(label);
    item.appendChild(anchor);
  } else {
    item.appendChild(label);
  }
  return item;
}

describe('sidebarItemFromTarget', () => {
  it('reads a top-level link', () => {
    const item = menuItem('default', true);
    const label = item.querySelector('[data-testid="menu-item-label"]') as Element;
    expect(sidebarItemFromTarget(label)).toEqual({ type: 'link', depth: 0, navigates: true });
  });

  it('counts nesting depth through parent menu items', () => {
    const parent = menuItem('group', false);
    const nested = document.createElement('ul');
    const child = menuItem('default', true);
    nested.appendChild(child);
    parent.appendChild(nested);
    const label = child.querySelector('[data-testid="menu-item-label"]') as Element;
    expect(sidebarItemFromTarget(label)).toEqual({ type: 'link', depth: 1, navigates: true });
  });

  it('recognises group toggles that do not navigate', () => {
    const item = menuItem('group', false);
    const label = item.querySelector('[data-testid="menu-item-label"]') as Element;
    expect(sidebarItemFromTarget(label)).toEqual({ type: 'group', depth: 0, navigates: false });
  });

  it('ignores clicks outside a menu item label', () => {
    const item = menuItem('default', true);
    expect(sidebarItemFromTarget(item)).toBeNull();
    expect(sidebarItemFromTarget(document.createElement('span'))).toBeNull();
  });
});
