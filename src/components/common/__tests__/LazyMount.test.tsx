import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

import { LazyMount } from '../LazyMount.js';

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

let observers: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  observed: Element[] = [];
  disconnected = false;
  private readonly callback: IntersectionCallback;

  constructor(callback: IntersectionCallback) {
    this.callback = callback;
    observers.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  disconnect() {
    this.disconnected = true;
  }

  enterViewport(isIntersecting = true) {
    act(() => this.callback([{ isIntersecting }]));
  }
}

const Child = () => <div data-testid="child">content</div>;

beforeEach(() => {
  observers = [];
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function stubPlaceholderRect(top: number): void {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 24,
    left: 0,
    right: 500,
    width: 500,
    height: 24,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

describe('LazyMount', () => {
  it('renders children immediately and observes nothing when forceMount is set', () => {
    render(
      <LazyMount forceMount>
        <Child />
      </LazyMount>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(observers).toHaveLength(0);
  });

  it('renders a placeholder and observes it until it reaches the viewport', () => {
    render(
      <LazyMount>
        <Child />
      </LazyMount>,
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(observers).toHaveLength(1);
    expect(observers[0].observed).toHaveLength(1);
  });

  it('mounts synchronously, without observing, when the placeholder is inside the viewport', () => {
    stubPlaceholderRect(100);

    render(
      <LazyMount>
        <Child />
      </LazyMount>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(observers).toHaveLength(0);
  });

  it('keeps observing a placeholder below the viewport, even inside the preload band', () => {
    stubPlaceholderRect(window.innerHeight + 400);

    render(
      <LazyMount>
        <Child />
      </LazyMount>,
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(observers).toHaveLength(1);
  });

  it('mounts children once the placeholder intersects, then disconnects the observer', () => {
    render(
      <LazyMount>
        <Child />
      </LazyMount>,
    );

    observers[0].enterViewport();

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(observers[0].disconnected).toBe(true);
  });

  it('keeps the placeholder when the entry is not intersecting', () => {
    render(
      <LazyMount>
        <Child />
      </LazyMount>,
    );

    observers[0].enterViewport(false);

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('reserves the estimated height on the placeholder', () => {
    const { container } = render(
      <LazyMount estimatedHeight={500}>
        <Child />
      </LazyMount>,
    );

    expect((container.firstElementChild as HTMLElement).style.minHeight).toBe('500px');
  });

  it('mounts immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    render(
      <LazyMount>
        <Child />
      </LazyMount>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
