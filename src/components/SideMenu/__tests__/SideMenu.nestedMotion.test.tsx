import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SideMenu } from '../SideMenu.js';

vi.mock('../useMenuItems.js', () => ({
  useMenuItems: () => [],
}));

vi.mock('../../../telemetry/index.js', () => ({
  useSidebarItemTelemetry: () => () => undefined,
}));

vi.mock('@redocly/theme/components/Menu/Menu', () => ({
  Menu: () => (
    <ul data-component-name="Menu/Menu">
      <div data-component-name="Menu/MenuItem" className="menu-item-type-group">
        <a href="/docs/authorization">Authorization</a>
        <div style={{ display: 'none', height: 0, overflow: 'hidden' }}>operations</div>
      </div>
    </ul>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('SideMenu nested motion', () => {
  it('hides a collapsed nested group from assistive tech', () => {
    const { container } = render(<SideMenu items={[]} />);
    const panel = container.querySelector<HTMLElement>(
      '[data-component-name="Menu/MenuItem"].menu-item-type-group > div',
    );

    expect(panel?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[data-component-name="Menu/Menu"]')?.getAttribute('role')).toBe(
      null,
    );
  });
});
