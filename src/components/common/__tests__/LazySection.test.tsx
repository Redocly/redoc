import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { LazySection, markSectionRendered } from '../LazySection.js';

type ObserverStub = {
  callback: IntersectionObserverCallback;
  observed: Element[];
};

let observers: ObserverStub[] = [];

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      private readonly stub: ObserverStub;

      constructor(callback: IntersectionObserverCallback) {
        this.stub = { callback, observed: [] };
        observers.push(this.stub);
      }

      observe(el: Element): void {
        this.stub.observed.push(el);
      }

      disconnect(): void {}
      unobserve(): void {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function intersect(): void {
  act(() => {
    for (const { callback } of observers) {
      callback(
        [{ isIntersecting: true }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    }
  });
}

function Body({ text }: { content?: unknown; text: string }) {
  return <p>{text}</p>;
}

describe('LazySection', () => {
  it('renders a placeholder carrying the section id until it scrolls into view', () => {
    const { container } = render(
      <LazySection sectionId="lazy-placeholder">
        <Body text="Section body" />
      </LazySection>,
    );

    expect(container.querySelector('[data-section-id="lazy-placeholder"]')).not.toBeNull();
    expect(screen.queryByText('Section body')).not.toBeInTheDocument();
  });

  it('mounts the children when the observer reports an intersection', () => {
    render(
      <LazySection sectionId="lazy-observed">
        <Body text="Section body" />
      </LazySection>,
    );

    intersect();

    expect(screen.getByText('Section body')).toBeInTheDocument();
  });

  it('mounts eagerly without waiting for the observer', () => {
    render(
      <LazySection sectionId="lazy-eager" eager>
        <Body text="Section body" />
      </LazySection>,
    );

    expect(screen.getByText('Section body')).toBeInTheDocument();
  });

  it('mounts without a placeholder once the section was marked as rendered', () => {
    markSectionRendered('lazy-marked');
    const { container } = render(
      <LazySection sectionId="lazy-marked">
        <Body text="Section body" />
      </LazySection>,
    );

    expect(screen.getByText('Section body')).toBeInTheDocument();
    expect(container.querySelector('[data-section-id="lazy-marked"]')).toBeNull();
  });

  it('updates the DOM when the content carried by the children changes', () => {
    const { rerender } = render(
      <LazySection sectionId="lazy-content" eager>
        <Body content="v1" text="first" />
      </LazySection>,
    );

    rerender(
      <LazySection sectionId="lazy-content" eager>
        <Body content="v2" text="second" />
      </LazySection>,
    );

    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('keeps the DOM when only the JSX changes and the content stays the same', () => {
    const { rerender } = render(
      <LazySection sectionId="lazy-same" eager>
        <Body content="v1" text="first" />
      </LazySection>,
    );

    rerender(
      <LazySection sectionId="lazy-same" eager>
        <Body content="v1" text="second" />
      </LazySection>,
    );

    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.queryByText('second')).not.toBeInTheDocument();
  });
});
