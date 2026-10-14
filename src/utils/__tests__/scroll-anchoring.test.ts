import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { keepReadingSectionAnchored } from '../scroll-anchoring.js';

type Rect = { top: number; bottom: number };

function mockRect(el: Element, rect: Rect): void {
  el.getBoundingClientRect = () =>
    ({ top: rect.top, bottom: rect.bottom, height: rect.bottom - rect.top }) as DOMRect;
}

function addSection(id: string, rect: Rect, parent: Element = document.body): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-section-id', id);
  el.scrollIntoView = vi.fn();
  mockRect(el, rect);
  parent.appendChild(el);
  return el;
}

describe('keepReadingSectionAnchored', () => {
  let rafCallbacks: FrameRequestCallback[];

  const flushRaf = (): void => {
    const callbacks = rafCallbacks;
    rafCallbacks = [];
    for (const callback of callbacks) callback(0);
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    rafCallbacks = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
  });

  afterEach(() => {
    flushRaf();
    vi.unstubAllGlobals();
  });

  it('pulls the reading section back into view when it collapses out of the viewport', () => {
    const section = addSection('op-a', { top: -6000, bottom: 2000 });

    keepReadingSectionAnchored();
    mockRect(section, { top: -6000, bottom: -4500 });
    flushRaf();

    expect(section.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });

  it('does nothing while the section is still visible', () => {
    const section = addSection('op-b', { top: -200, bottom: 1500 });

    keepReadingSectionAnchored();
    mockRect(section, { top: -200, bottom: 600 });
    flushRaf();

    expect(section.scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not schedule a correction when no section is under the reading line', () => {
    addSection('op-c', { top: 500, bottom: 1200 });

    keepReadingSectionAnchored();

    expect(rafCallbacks).toHaveLength(0);
  });

  it('anchors the top-level row, not nested section markers like the oneOf switcher', () => {
    const outer = addSection('op-d', { top: -100, bottom: 5000 });
    const nested = addSection('switcher', { top: 100, bottom: 300 }, outer);

    keepReadingSectionAnchored();
    mockRect(outer, { top: -100, bottom: -50 });
    mockRect(nested, { top: -90, bottom: -60 });
    flushRaf();

    expect(outer.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    expect(nested.scrollIntoView).not.toHaveBeenCalled();
  });

  it('coalesces multiple writes in the same frame into one correction', () => {
    addSection('op-e', { top: -100, bottom: 1500 });

    keepReadingSectionAnchored();
    keepReadingSectionAnchored();

    expect(rafCallbacks).toHaveLength(1);
  });

  it('bails out when the captured section was removed from the DOM', () => {
    const section = addSection('op-f', { top: -100, bottom: 1500 });

    keepReadingSectionAnchored();
    section.remove();

    expect(() => flushRaf()).not.toThrow();
    expect(section.scrollIntoView).not.toHaveBeenCalled();
  });
});
