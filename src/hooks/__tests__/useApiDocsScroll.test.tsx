import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter, useNavigate } from 'react-router';

import type { ReactNode } from 'react';
import type * as ReactRouterDom from 'react-router';
import type { ApiItemContent } from '../../types/store.js';
import type { RouteItem } from '../../utils/routing.js';
import type { ApiDocsOptions } from '../../types/options.js';

import { contentType } from '../../types/common.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { buildRouteIndex } from '../../utils/routing.js';
import { useApiDocsScroll } from '../useApiDocsScroll.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, IS_BROWSER: true };
});

const { navigateSpy } = vi.hoisted(() => ({ navigateSpy: vi.fn() }));
// Pass-through spy: records calls (for the legacy-hash redirect assertions)
// AND performs the real navigation, so tests can exercise genuine location
// changes (a same-path navigation must still produce a new location.key).
vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ReactRouterDom;
  return {
    ...actual,
    useNavigate: (): ReturnType<typeof actual.useNavigate> => {
      const realNavigate = actual.useNavigate();
      return ((...args: unknown[]) => {
        navigateSpy(...args);
        (realNavigate as (...navigateArgs: unknown[]) => void)(...args);
      }) as ReturnType<typeof actual.useNavigate>;
    },
  };
});

function makeRoute(overrides: Partial<RouteItem> = {}): RouteItem {
  return {
    path: '/pets',
    label: 'Pets',
    content: { contentType: contentType.GROUP, children: [] } as ApiItemContent,
    ...overrides,
  };
}

function makeElementWithScrollSpy(): {
  el: HTMLDivElement;
  scrollIntoViewSpy: ReturnType<typeof vi.fn>;
} {
  const el = document.createElement('div');
  const scrollIntoViewSpy = vi.fn();
  el.scrollIntoView = scrollIntoViewSpy;
  return { el, scrollIntoViewSpy };
}

type RenderOpts = {
  initialEntries?: string[];
  routingBasePath?: string;
  activeRoute?: RouteItem | undefined;
  routes?: RouteItem[];
};

function renderUseApiDocsScroll(opts: RenderOpts = {}) {
  // Use `in` checks instead of destructuring defaults so callers can pass
  // `activeRoute: undefined` to mean "no active route" (destructuring would
  // substitute the default for explicit undefined).
  const initialEntries = opts.initialEntries ?? ['/pets'];
  const routingBasePath = opts.routingBasePath ?? '';
  const activeRoute = 'activeRoute' in opts ? opts.activeRoute : makeRoute();
  const routes = opts.routes ?? (activeRoute ? [activeRoute] : []);
  const routeIndex = buildRouteIndex(routes, [], routingBasePath);

  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: { basePath: routingBasePath } as ApiDocsOptions,
    replayDefinition: null,
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <JotaiProvider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </JotaiProvider>
  );

  return renderHook(
    () => {
      useApiDocsScroll({ activeRoute, routeIndex, basePath: routingBasePath });
      return useNavigate();
    },
    { wrapper },
  );
}

describe('useApiDocsScroll', () => {
  let getElementByIdSpy: ReturnType<typeof vi.spyOn>;
  let querySelectorSpy: ReturnType<typeof vi.spyOn>;
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // Default stub so scrollIntoView calls on plain test elements don't throw —
    // tests that care about the call use their own spy via makeElementWithScrollSpy.
    HTMLElement.prototype.scrollIntoView = vi.fn();
    getElementByIdSpy = vi.spyOn(document, 'getElementById');
    querySelectorSpy = vi.spyOn(document, 'querySelector');
    navigateSpy.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    getElementByIdSpy.mockRestore();
    querySelectorSpy.mockRestore();
    scrollToSpy.mockRestore();
  });

  describe('section by path', () => {
    it('scrollIntoView({block:start}) on the [data-section-id] matching the active route', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/section/pets"]' ? el : null,
      );

      renderUseApiDocsScroll({
        activeRoute: makeRoute({ path: '/section/pets' }),
      });

      expect(querySelectorSpy).toHaveBeenCalledWith('[data-section-id="/section/pets"]');
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('works for section pointer routes with the base prefix', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/docs/section/intro"]' ? el : null,
      );

      renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/section/intro'],
        activeRoute: makeRoute({
          path: '/docs/section/intro',
          content: null as unknown as ApiItemContent,
        }),
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('lands at the document top when the section is the first one on the page', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      el.setAttribute('data-section-id', '/section/pets');
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/section/pets"]' || selector === '[data-section-id]'
          ? el
          : null,
      );

      renderUseApiDocsScroll({
        activeRoute: makeRoute({ path: '/section/pets' }),
      });

      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
    });

    it('scrolls the section into view when another section precedes it', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      el.setAttribute('data-section-id', '/section/pets');
      const precedingSection = document.createElement('div');
      querySelectorSpy.mockImplementation((selector: string) => {
        if (selector === '[data-section-id="/section/pets"]') return el;
        if (selector === '[data-section-id]') return precedingSection;
        return null;
      });

      renderUseApiDocsScroll({
        activeRoute: makeRoute({ path: '/section/pets' }),
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it('skips the section lookup when no active route is matched', () => {
      renderUseApiDocsScroll({ activeRoute: undefined });
      expect(querySelectorSpy).not.toHaveBeenCalled();
    });
  });

  describe('hash deep link (highest priority)', () => {
    it('scrolls to the hash element when the URL has a hash', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      getElementByIdSpy.mockReturnValue(el);

      renderUseApiDocsScroll({ initialEntries: ['/pets#response/headers'] });

      expect(getElementByIdSpy).toHaveBeenCalledWith('response/headers');
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('wins over the section-by-routeSlug strategy when both could fire', () => {
      // Regression: hash must short-circuit BEFORE the section lookup.
      const { el: hashEl, scrollIntoViewSpy: hashSpy } = makeElementWithScrollSpy();
      const { el: sectionEl, scrollIntoViewSpy: sectionSpy } = makeElementWithScrollSpy();
      getElementByIdSpy.mockReturnValue(hashEl);
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/section/pets"]' ? sectionEl : null,
      );

      renderUseApiDocsScroll({
        initialEntries: ['/pets#response/headers'],
      });

      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(sectionSpy).not.toHaveBeenCalled();
    });
  });

  describe('legacy hash without [] array markers', () => {
    // Legacy openapi-docs deep links carry no `[]` array markers, so the
    // exact getElementById lookup misses; the fallback must find the element
    // whose id differs only by those markers.
    it('scrolls to the element whose id matches after stripping [] markers', () => {
      const el = document.createElement('div');
      el.id = 'ai-jobs/listaijobs/t=response&c=200&path=items[]&d=1/options';
      const scrollIntoViewSpy = vi.fn();
      el.scrollIntoView = scrollIntoViewSpy;
      document.body.appendChild(el);
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({
        initialEntries: ['/pets#ai-jobs/listaijobs/t=response&c=200&path=items&d=1/options'],
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
      document.body.removeChild(el);
    });

    it('does not match unrelated ids', () => {
      const el = document.createElement('div');
      el.id = 'ai-jobs/listaijobs/t=response&c=200&path=other[]&d=1/options';
      const scrollIntoViewSpy = vi.fn();
      el.scrollIntoView = scrollIntoViewSpy;
      document.body.appendChild(el);
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({
        initialEntries: ['/pets#ai-jobs/listaijobs/t=response&c=200&path=items&d=1/options'],
      });

      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
      document.body.removeChild(el);
    });
  });

  describe('legacy callback hash without the callbacks/ segment', () => {
    // Legacy openapi-docs prefixed callback sections with a bare `<callbackId>/`;
    // canonical ids carry a `callbacks/` segment, so the exact lookup misses.
    const renderWithElementId = (id: string, hash: string) => {
      const el = document.createElement('div');
      el.id = id;
      const scrollIntoViewSpy = vi.fn();
      el.scrollIntoView = scrollIntoViewSpy;
      document.body.appendChild(el);
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({ initialEntries: [`/pets#${hash}`] });

      document.body.removeChild(el);
      return scrollIntoViewSpy;
    };

    it('scrolls to the element whose id matches after inserting the callbacks/ segment', () => {
      const scrollIntoViewSpy = renderWithElementId(
        'other/createjob/callbacks/jobcompleted/post/request/body',
        'other/createjob/jobcompleted/post/request/body',
      );

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('retries the lookup on the &-stripped section id (legacy response-tab links)', () => {
      const scrollIntoViewSpy = renderWithElementId(
        'other/createjob/callbacks/jobcompleted/post/callback-response',
        'other/createjob/jobcompleted/post/callback-response&c=200',
      );

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('does not match a different callback', () => {
      const scrollIntoViewSpy = renderWithElementId(
        'other/createjob/callbacks/jobfailed/post/request/body',
        'other/createjob/jobcompleted/post/request/body',
      );

      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
    });
  });

  describe('same-path navigation re-scrolls', () => {
    it('re-scrolls when navigating to the pathname the router already holds (scroll-spy rewrote the browser URL silently, so the sidebar link is string-equal)', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' ? el : null,
      );

      const { result } = renderUseApiDocsScroll();
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);

      // The user scrolled away (scroll-spy replaceUrlSilently'd the browser
      // URL, invisible to the router), then clicked the sidebar link for the
      // route the router still remembers. The navigation produces a new
      // location.key with a string-equal pathname/hash — it must still scroll.
      act(() => {
        result.current('/pets');
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('link-icon navigation', () => {
    it('glides to the target once instead of pinning it', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      const { result } = renderUseApiDocsScroll();
      getElementByIdSpy.mockImplementation((id: string) => (id === 'pets/t=field' ? el : null));

      act(() => {
        result.current('/pets#pets/t=field', { state: { smoothScroll: true } });
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
    });

    it('glides again when the link points at the current URL', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      const { result } = renderUseApiDocsScroll({ initialEntries: ['/pets#pets/t=field'] });
      getElementByIdSpy.mockImplementation((id: string) => (id === 'pets/t=field' ? el : null));

      act(() => {
        result.current('/pets#pets/t=field', { replace: true, state: { smoothScroll: true } });
      });

      expect(scrollIntoViewSpy).toHaveBeenLastCalledWith({ block: 'start', behavior: 'smooth' });
    });

    it('pins without animation on back/forward onto a link-icon entry', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      const { result } = renderUseApiDocsScroll();
      getElementByIdSpy.mockImplementation((id: string) => (id === 'pets/t=field' ? el : null));

      act(() => {
        result.current('/pets#pets/t=field', { state: { smoothScroll: true } });
      });
      act(() => {
        result.current('/pets');
      });
      act(() => {
        result.current(-1);
      });

      expect(scrollIntoViewSpy).toHaveBeenLastCalledWith({ block: 'start' });
    });

    it('jumps without animation when the user prefers reduced motion', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      const { result } = renderUseApiDocsScroll();
      getElementByIdSpy.mockImplementation((id: string) => (id === 'pets/t=field' ? el : null));

      act(() => {
        result.current('/pets#pets/t=field', { state: { smoothScroll: true } });
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' });
    });
  });

  describe('expand-in-place navigation', () => {
    it('does not anchor a pushed navigation flagged expandInPlace, but anchors again on back/forward', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' ? el : null,
      );

      const { result } = renderUseApiDocsScroll();
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);

      act(() => {
        result.current('/pets', { state: { expandInPlace: true } });
      });
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);

      act(() => {
        result.current(-1);
      });
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);

      act(() => {
        result.current(1);
      });
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('layout-settle anchoring', () => {
    class ResizeObserverStub {
      static instances: ResizeObserverStub[] = [];
      disconnected = false;
      observing = false;
      private lastHeight = 0;
      private callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        ResizeObserverStub.instances.push(this);
      }
      observe(): void {
        this.observing = true;
      }
      unobserve(): void {
        this.observing = false;
      }
      disconnect(): void {
        this.disconnected = true;
        this.observing = false;
      }
      /** Reports a body size; a new one unless `height` is given. */
      trigger(height = ++this.lastHeight): void {
        // A real ResizeObserver never notifies an unobserved or disconnected target.
        if (!this.observing) return;
        const entry = { contentRect: { width: 1024, height } } as ResizeObserverEntry;
        this.callback([entry], this as unknown as ResizeObserver);
      }
    }

    const frames = new Map<number, FrameRequestCallback>();
    let lastFrameId = 0;

    function runFrame(): void {
      const due = [...frames.values()];
      frames.clear();
      for (const callback of due) callback(0);
    }

    beforeEach(() => {
      ResizeObserverStub.instances = [];
      vi.stubGlobal('ResizeObserver', ResizeObserverStub);
      frames.clear();
      vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        frames.set(++lastFrameId, callback);
        return lastFrameId;
      });
      vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    function renderAnchored() {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' ? el : null,
      );
      const rendered = renderUseApiDocsScroll();
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
      const [observer] = ResizeObserverStub.instances;
      return { ...rendered, el, scrollIntoViewSpy, observer };
    }

    it('does not anchor a leading section — the top of the page has nothing above it to settle', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      el.setAttribute('data-section-id', '/pets');
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' || selector === '[data-section-id]' ? el : null,
      );
      renderUseApiDocsScroll();

      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
      expect(ResizeObserverStub.instances).toHaveLength(0);
    });

    it('re-aligns the target when layout changes after the initial scroll', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      observer.trigger();

      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
      expect(scrollIntoViewSpy).toHaveBeenLastCalledWith({ block: 'start' });
    });

    it('stops re-aligning on user scroll intent', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      window.dispatchEvent(new Event('wheel'));
      observer.trigger();

      expect(observer.disconnected).toBe(true);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
    });

    it('keeps re-aligning through content clicks and typing (not scroll intent)', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      observer.trigger();

      expect(observer.disconnected).toBe(false);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
    });

    it('stops re-aligning on a scrollbar mousedown', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      document.documentElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      observer.trigger();

      expect(observer.disconnected).toBe(true);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
    });

    it('keeps re-aligning on scroll events while the target stays at its anchored position', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      window.dispatchEvent(new Event('scroll'));
      observer.trigger();

      expect(observer.disconnected).toBe(false);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
    });

    it('stops re-aligning when a scroll moves the target away (scrollbar drag, find-in-page)', () => {
      const { el, scrollIntoViewSpy, observer } = renderAnchored();

      el.getBoundingClientRect = () => ({ top: 300 }) as unknown as DOMRect;
      window.dispatchEvent(new Event('scroll'));
      observer.trigger();

      expect(observer.disconnected).toBe(true);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
    });

    it('re-pins (does not surrender) when a reflow drifts the target — document height changed', () => {
      const { el, scrollIntoViewSpy, observer } = renderAnchored();

      el.getBoundingClientRect = () => ({ top: 300 }) as unknown as DOMRect;
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        configurable: true,
        value: 5000,
      });
      try {
        window.dispatchEvent(new Event('scroll'));

        expect(observer.disconnected).toBe(false);
        expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
        expect(scrollIntoViewSpy).toHaveBeenLastCalledWith({ block: 'start' });
      } finally {
        delete (document.documentElement as unknown as { scrollHeight?: number }).scrollHeight;
      }
    });

    it('disconnects on effect cleanup', () => {
      const { unmount, observer } = renderAnchored();

      unmount();

      expect(observer.disconnected).toBe(true);
    });

    it('unobserves the body after a re-pin and observes it again on the next frame', () => {
      const { observer } = renderAnchored();

      observer.trigger();
      expect(observer.observing).toBe(false);

      runFrame();
      expect(observer.observing).toBe(true);
    });

    it('does not re-pin for the unchanged size a re-observe reports', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      observer.trigger(500);
      runFrame();
      observer.trigger(500);

      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(2);
    });

    it('re-pins when the size changed while the body was unobserved', () => {
      const { scrollIntoViewSpy, observer } = renderAnchored();

      observer.trigger(500);
      runFrame();
      observer.trigger(700);

      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(3);
    });

    it('drops a pending re-observe on cancel', () => {
      const { observer } = renderAnchored();

      observer.trigger();
      window.dispatchEvent(new Event('wheel'));
      runFrame();

      expect(observer.disconnected).toBe(true);
      expect(observer.observing).toBe(false);
    });

    it('scrolls to a deep-link field that only mounts on a later layout tick', () => {
      const hashId = 'pets/getpet/t=response&path=createdbyid';
      const { el: fieldEl, scrollIntoViewSpy: fieldSpy } = makeElementWithScrollSpy();

      let fieldMounted = false;
      getElementByIdSpy.mockImplementation((id: string) =>
        fieldMounted && id === hashId ? fieldEl : null,
      );

      renderUseApiDocsScroll({ initialEntries: [`/pets#${hashId}`] });

      expect(fieldSpy).not.toHaveBeenCalled();

      fieldMounted = true;
      const [observer] = ResizeObserverStub.instances;
      observer.trigger();

      expect(fieldSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('anchors the active section while a deep-link field has not mounted yet', () => {
      // Regression: a field deep link (`t=response&c=200&path=lineitems[]/updatedtime`)
      // only mounts once its response panel expands. With nothing anchored in the
      // meantime, `EntryPage`'s hydration flip prepends every entry above the active
      // one and leaves the viewport on empty placeholders — a blank page.
      const hashId = 'pets/getpet/t=response&c=200&path=items[]/updatedtime';
      const { el: fieldEl, scrollIntoViewSpy: fieldSpy } = makeElementWithScrollSpy();
      const { el: sectionEl, scrollIntoViewSpy: sectionSpy } = makeElementWithScrollSpy();

      let fieldMounted = false;
      getElementByIdSpy.mockImplementation((id: string) =>
        fieldMounted && id === hashId ? fieldEl : null,
      );
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' ? sectionEl : null,
      );

      renderUseApiDocsScroll({ initialEntries: [`/pets#${hashId}`] });

      expect(sectionSpy).toHaveBeenCalledWith({ block: 'start' });
      expect(fieldSpy).not.toHaveBeenCalled();

      // Once the field exists it takes over as the anchor.
      fieldMounted = true;
      const [observer] = ResizeObserverStub.instances;
      observer.trigger();

      expect(fieldSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('stops anchoring the section once the deep-link field has resolved', () => {
      // The section fallback is only a stand-in until the field first appears.
      // After that a field that unmounts (variant switch) must stay put.
      const hashId = 'pets/getpet/t=response&c=200&path=items[]/updatedtime';
      const { el: fieldEl } = makeElementWithScrollSpy();
      const { el: sectionEl, scrollIntoViewSpy: sectionSpy } = makeElementWithScrollSpy();

      let fieldMounted = false;
      getElementByIdSpy.mockImplementation((id: string) =>
        fieldMounted && id === hashId ? fieldEl : null,
      );
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' ? sectionEl : null,
      );

      renderUseApiDocsScroll({ initialEntries: [`/pets#${hashId}`] });
      expect(sectionSpy).toHaveBeenCalledTimes(1);

      const [observer] = ResizeObserverStub.instances;
      fieldMounted = true;
      observer.trigger();

      runFrame();
      fieldMounted = false;
      observer.trigger();

      expect(sectionSpy).toHaveBeenCalledTimes(1);
    });

    it('does not jump to the section when a deep-link field later unmounts', () => {
      const hashId = 'pets/getpet/t=response&path=createdbyid';
      const { el: fieldEl, scrollIntoViewSpy: fieldSpy } = makeElementWithScrollSpy();
      const { el: sectionEl, scrollIntoViewSpy: sectionSpy } = makeElementWithScrollSpy();

      let fieldMounted = true;
      getElementByIdSpy.mockImplementation((id: string) =>
        fieldMounted && id === hashId ? fieldEl : null,
      );
      querySelectorSpy.mockImplementation((selector: string) =>
        selector === '[data-section-id="/pets"]' ? sectionEl : null,
      );

      renderUseApiDocsScroll({ initialEntries: [`/pets#${hashId}`] });

      expect(fieldSpy).toHaveBeenCalledTimes(1);
      expect(sectionSpy).not.toHaveBeenCalled();

      fieldMounted = false;
      const [observer] = ResizeObserverStub.instances;
      observer.trigger();

      expect(sectionSpy).not.toHaveBeenCalled();
    });
  });

  describe('scroll restoration', () => {
    it('takes over scrollRestoration and restores it on unmount', () => {
      Object.defineProperty(window.history, 'scrollRestoration', {
        value: 'auto',
        writable: true,
        configurable: true,
      });

      const { unmount } = renderUseApiDocsScroll();
      expect(window.history.scrollRestoration).toBe('manual');

      unmount();
      expect(window.history.scrollRestoration).toBe('auto');
    });
  });

  describe('in-description hash links to a section route', () => {
    it('navigates to the owning route when the hash has no element on the current page', () => {
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/pets#section/pagination'],
        activeRoute: makeRoute({ path: '/docs/pets' }),
        routes: [
          makeRoute({ path: '/docs/pets' }),
          makeRoute({
            path: '/docs/section/pagination',
            content: null as unknown as ApiItemContent,
          }),
        ],
      });

      expect(navigateSpy).toHaveBeenCalledWith('/docs/section/pagination', { replace: true });
    });

    it('resolves legacy #operation hash to the matching route', () => {
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/pets#operation/getPetById'],
        activeRoute: makeRoute({ path: '/docs/pets' }),
        routes: [makeRoute({ path: '/docs/pets' }), makeRoute({ path: '/docs/pets/getpetbyid' })],
      });

      expect(navigateSpy).toHaveBeenCalledWith('/docs/pets/getpetbyid', { replace: true });
    });

    it('rewrites a same-page legacy hash with a suffix and scrolls to its element', async () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      getElementByIdSpy.mockImplementation((id: string) =>
        id === 'pets/getpetbyid/callbacks' ? el : null,
      );

      const { result } = renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/pets/getpetbyid'],
        activeRoute: makeRoute({ path: '/docs/pets/getpetbyid' }),
        routes: [makeRoute({ path: '/docs/pets/getpetbyid' })],
      });
      navigateSpy.mockClear();

      await act(async () => {
        result.current('/docs/pets/getpetbyid#operation/getPetById/callbacks');
      });

      expect(navigateSpy).toHaveBeenCalledWith('/docs/pets/getpetbyid#pets/getpetbyid/callbacks', {
        replace: true,
      });
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
    });

    it('does not navigate again when the rewritten hash resolves to the current URL (no replace loop)', () => {
      // Pointer-based slugs (operations without an operationId) start with `paths/`,
      // so the rewritten hash re-triggers the legacy detection on every pass.
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/paths/~1pets/get#paths/~1pets/get/callbacks'],
        activeRoute: makeRoute({ path: '/docs/paths/~1pets/get' }),
        routes: [makeRoute({ path: '/docs/paths/~1pets/get' })],
      });

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('leaves genuine in-page hash anchors alone (element found → scroll, no navigate)', () => {
      const { el, scrollIntoViewSpy } = makeElementWithScrollSpy();
      getElementByIdSpy.mockReturnValue(el);

      renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/pets#pets/getpet/request'],
        activeRoute: makeRoute({ path: '/docs/pets' }),
        routes: [makeRoute({ path: '/docs/pets' })],
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'start' });
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('does not navigate when a missing hash matches no route', () => {
      getElementByIdSpy.mockReturnValue(null);

      renderUseApiDocsScroll({
        routingBasePath: '/docs',
        initialEntries: ['/docs/pets#does/not/exist'],
        activeRoute: makeRoute({ path: '/docs/pets' }),
        routes: [makeRoute({ path: '/docs/pets' })],
      });

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
