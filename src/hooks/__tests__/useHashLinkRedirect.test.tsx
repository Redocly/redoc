import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { ReactNode, MouseEvent } from 'react';
import type { ApiItemContent } from '../../types/store.js';
import type { RouteItem } from '../../utils/routing.js';

import { contentType } from '../../types/common.js';
import { buildRouteIndex } from '../../utils/routing.js';
import { useHashLinkRedirect } from '../useHashLinkRedirect.js';

const { navigateSpy } = vi.hoisted(() => ({ navigateSpy: vi.fn() }));
vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, useNavigate: () => navigateSpy };
});

function makeRoute(overrides: Partial<RouteItem> = {}): RouteItem {
  return {
    path: '/docs/pets',
    label: 'Pets',
    content: { contentType: contentType.GROUP, children: [] } as ApiItemContent,
    ...overrides,
  };
}

const ROUTES = [
  makeRoute({ path: '/docs/pets' }),
  makeRoute({ path: '/docs/section/pagination', content: null as unknown as ApiItemContent }),
  makeRoute({ path: '/docs/customers/getcustomer' }),
];

function renderHandler() {
  const routeIndex = buildRouteIndex(ROUTES, [], '/docs');
  const { result } = renderHook(() => useHashLinkRedirect('/docs', routeIndex), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/docs/pets']}>{children}</MemoryRouter>
    ),
  });
  window.history.replaceState({}, '', '/docs/pets');

  const click = (href: string, init: Partial<MouseEvent<HTMLElement>> = {}) => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    let defaultPrevented = false;
    const event = {
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      target: anchor,
      preventDefault: () => {
        defaultPrevented = true;
      },
      ...init,
    } as unknown as MouseEvent<HTMLElement>;
    result.current(event);
    return { defaultPrevented };
  };

  return { click };
}

describe('useHashLinkRedirect', () => {
  beforeEach(() => {
    navigateSpy.mockClear();
    window.history.replaceState({}, '', '/docs/pets');
  });

  it('routes a `#section/…` link to the section route and prevents default', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('/docs/pets#section/pagination');

    expect(defaultPrevented).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/docs/section/pagination');
  });

  it('resolves a bare relative `#section/…` href', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('#section/pagination');

    expect(defaultPrevented).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/docs/section/pagination');
  });

  it('resolves a legacy `#operation/…` link', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('/docs/pets#operation/getCustomer');

    expect(defaultPrevented).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/docs/customers/getcustomer');
  });

  it('rewrites a same-page legacy hash with a suffix instead of leaving it to the browser', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('/docs/pets#operation/pets/responses');

    expect(defaultPrevented).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/docs/pets#pets/responses');
  });

  it('leaves anchors that resolve to no route to the browser', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('/docs/pets#pets/getpet/request');

    expect(defaultPrevented).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('ignores modified clicks (open-in-new-tab)', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('/docs/pets#section/pagination', { metaKey: true });

    expect(defaultPrevented).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('ignores cross-origin anchors', () => {
    const { click } = renderHandler();
    const { defaultPrevented } = click('https://example.com/x#section/pagination');

    expect(defaultPrevented).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
