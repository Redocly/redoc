import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';

import type { RouteIndex, RouteItem } from '../utils/routing.js';

import { IS_BROWSER } from '@redocly/theme/core/openapi';

import { SECTION_ATTR } from '../constants/openapi.js';
import {
  hashToElementId,
  resolveLegacyHashToRoute,
  stripArrayMarkers,
  stripCallbacksSegment,
} from '../utils/deep-link.js';
import {
  USER_SCROLL_INTENT_EVENTS,
  WHEEL_INTENT_THRESHOLD_PX,
  createScrollIntentTracker,
} from './useUserScrollIntent.js';

type UseApiDocsScrollOptions = {
  activeRoute: RouteItem | undefined;
  routeIndex: RouteIndex;
  basePath: string;
  isHydrated?: boolean;
};

export function useApiDocsScroll({
  activeRoute,
  routeIndex,
  basePath,
  isHydrated,
}: UseApiDocsScrollOptions): void {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const activeSlug = activeRoute?.path;

  useEffect(() => {
    if (!IS_BROWSER) return;
    if (!('scrollRestoration' in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (!IS_BROWSER) return;
    const { hash } = location;
    const elementId = hash ? hashToElementId(hash) : '';

    if (elementId && !findElementByHashId(elementId)) {
      const targetRoute = resolveLegacyHashToRoute(hash, basePath, routeIndex);
      if (targetRoute && targetRoute !== location.pathname + location.hash) {
        navigate(targetRoute, { replace: true });
        return;
      }
    }

    if (!elementId && !activeSlug) return;

    // A click on the current URL arrives as REPLACE; back/forward (POP) restore the entry's
    // state too, and must not animate.
    if (elementId && navigationType !== 'POP' && location.state?.smoothScroll) {
      const target = document.getElementById(elementId);
      if (target) {
        target.scrollIntoView({
          block: 'start',
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
        return;
      }
    }

    // A collapsed group's "+ Show" pushes the group route to expand it where it stands; the
    // page stays put.
    if (!elementId && navigationType === 'PUSH' && location.state?.expandInPlace) return;

    // The first section on the page is the top of the page: land there so whatever sits
    // above it (breadcrumbs, a custom sub-navigation) stays in view.
    if (
      !elementId &&
      findSectionTarget(activeSlug) === document.querySelector(`[${SECTION_ATTR}]`)
    ) {
      window.scrollTo(0, 0);
      return;
    }

    return keepAnchoredWhileLayoutSettles(createTargetResolver(elementId, activeSlug));
  }, [location, navigationType, activeSlug, isHydrated, navigate, basePath, routeIndex]);
}

/** What to keep anchored, re-resolved on every layout tick.
 *
 *  A field deep link (`t=response&c=200&path=lineitems[]/updatedtime`) points at an
 *  element that only exists once its panel has expanded, which happens after the first
 *  commits. Anchoring nothing until then leaves the viewport wherever it was: on the
 *  initial load `EntryPage`'s hydration flip prepends every entry above the active one,
 *  so a scroll offset of 0 lands on empty `LazySection` placeholders — a blank page
 *  until the field finally mounts. Anchoring the section keeps the operation in view
 *  meanwhile, and the field takes over as soon as it appears.
 *
 *  The fallback is one-way: once the field has resolved we never go back to the
 *  section, so a field that later unmounts (discriminator/variant switch) stays put
 *  instead of jumping to the top of the operation.
 */
function createTargetResolver(
  elementId: string,
  activeSlug: string | undefined,
): () => Element | null {
  if (!elementId) return () => findSectionTarget(activeSlug);

  let fieldResolved = false;
  return () => {
    const field = findElementByHashId(elementId);
    if (field) {
      fieldResolved = true;
      return field;
    }
    return fieldResolved ? null : findSectionTarget(activeSlug);
  };
}

/** Px the target may drift before we treat the scroll as user-driven. Shares
 *  the wheel-intent threshold so trackpad noise (which really scrolls the
 *  page a few px per tick) neither cancels the pinning here nor opens the
 *  scroll-spy gate — the two must agree or a micro-wheel during the mount
 *  pump rewrites the URL to a neighboring section. */
const ANCHOR_DRIFT_TOLERANCE_PX = WHEEL_INTENT_THRESHOLD_PX;

/** Pin the target while lazy content settles; stops on user scroll intent.
 *  `getTarget` is re-resolved each tick, so a late-mounting target is picked up once it
 *  exists and a vanished one just stops re-pinning (returns null). */
function keepAnchoredWhileLayoutSettles(getTarget: () => Element | null): () => void {
  let target = getTarget();
  target?.scrollIntoView({ block: 'start' });
  if (typeof ResizeObserver === 'undefined') return () => {};

  const docEl = document.documentElement;
  const controller = new AbortController();
  let anchorTop = target ? target.getBoundingClientRect().top : 0;
  let lastDocHeight = docEl.scrollHeight;

  function pin(next: Element): void {
    target = next;
    next.scrollIntoView({ block: 'start' });
    anchorTop = next.getBoundingClientRect().top;
    lastDocHeight = docEl.scrollHeight;
  }

  let lastHeight = 0;

  const observer = new ResizeObserver(([entry]) => {
    if (entry.contentRect.height === lastHeight) return;
    lastHeight = entry.contentRect.height;
    const next = getTarget();
    if (next) pin(next);
    // Re-observe next frame so the layout pin() forces isn't reported as a ResizeObserver loop.
    observer.unobserve(document.body);
    requestAnimationFrame(() => {
      if (!controller.signal.aborted) observer.observe(document.body);
    });
  });
  observer.observe(document.body);

  // Drift past tolerance = the user took over (scrollbar drag / find-in-page: height
  // unchanged → cancel) or lazy content reflowed above the target (height changed →
  // re-pin, so a reflow between ResizeObserver ticks doesn't strand it mid-viewport).
  function onScroll(): void {
    if (!target) return;
    if (Math.abs(target.getBoundingClientRect().top - anchorTop) <= ANCHOR_DRIFT_TOLERANCE_PX)
      return;

    if (docEl.scrollHeight === lastDocHeight) {
      cancel();
    } else {
      pin(target);
    }
  }

  // Only a genuine scroll gesture means the user took over — a plain click,
  // typing, or trackpad micro-wheel noise must not stop us re-pinning while
  // lazy content is still settling.
  const isIntent = createScrollIntentTracker();
  function onIntent(event: Event): void {
    if (isIntent(event)) cancel();
  }

  function cancel(): void {
    observer.disconnect();
    controller.abort();
  }

  const options = { capture: true, passive: true, signal: controller.signal };
  window.addEventListener('scroll', onScroll, options);
  for (const event of USER_SCROLL_INTENT_EVENTS) {
    window.addEventListener(event, onIntent, options);
  }
  return cancel;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Exact id first, then the coarser `&`-stripped section id; each with legacy fallbacks. */
function findElementByHashId(elementId: string): HTMLElement | null {
  if (!elementId) return null;
  const sectionId = elementId.split('&')[0];
  const candidateIds = sectionId === elementId ? [elementId] : [elementId, sectionId];

  for (const id of candidateIds) {
    const element = document.getElementById(id) ?? findLegacyHashTarget(id);
    if (element) return element;
  }
  return null;
}

/**
 * Legacy (openapi-docs) deep links support
 */
function findLegacyHashTarget(elementId: string): HTMLElement | null {
  return findLegacyArrayTarget(elementId) ?? findLegacyCallbackTarget(elementId);
}

function findLegacyArrayTarget(elementId: string): HTMLElement | null {
  if (elementId.includes('[]')) return null;
  for (const el of document.querySelectorAll<HTMLElement>('[id*="[]"]')) {
    if (stripArrayMarkers(el.id) === elementId) return el;
  }
  return null;
}

/** Legacy prefixed callback sections with a bare `<callbackId>/`, without the `callbacks/`
 *  segment canonical ids carry. Scanned only when the requested id lacks it. */
function findLegacyCallbackTarget(elementId: string): HTMLElement | null {
  if (elementId.includes('/callbacks/')) return null;
  for (const el of document.querySelectorAll<HTMLElement>('[id*="/callbacks/"]')) {
    if (stripCallbacksSegment(el.id) === elementId) return el;
  }
  return null;
}

function findSectionTarget(routeSlug: string | undefined): Element | null {
  if (!routeSlug) return null;
  // Only `"` and `\` need escaping inside a double-quoted attribute value.
  const safeSlug = routeSlug.replace(/["\\]/g, '\\$&');
  return document.querySelector(`[${SECTION_ATTR}="${safeSlug}"]`);
}
