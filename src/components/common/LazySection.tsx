import { isValidElement, memo, startTransition, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import type { ReactElement, ReactNode } from 'react';

import { SECTION_ATTR } from '../../constants/openapi.js';
import { useManualScrollAnchor } from '../../hooks/useManualScrollAnchor.js';

type LazySectionProps = {
  /** `data-section-id` placed on the placeholder (used for URL → element lookup
   *  while the section is still cold). Once mounted, the inner content owns
   *  its own `data-section-id`. */
  sectionId: string;
  /** Render the real content immediately, skipping the placeholder/observer step. */
  eager?: boolean;
  children: ReactNode;
};

/** Section ids whose content has been rendered at least once this session.
 *  Lets a section that briefly unmounts re-render immediately instead of
 *  going back through the placeholder/observer dance. */
const renderedSections = new Set<string>();

export function markSectionRendered(sectionId: string): void {
  renderedSections.add(sectionId);
}

// Only pre-mount sections below the viewport ("top right bottom left").
// Sized to roughly half a viewport of lead time.
const PRELOAD_MARGIN = '0px 0px 200px 0px';
const PLACEHOLDER_HEIGHT_PX = 100;

function LazySectionComponent({
  sectionId,
  eager = false,
  children,
}: LazySectionProps): ReactElement {
  const [mounted, setMounted] = useState<boolean>(() => eager || renderedSections.has(sectionId));
  if (eager && !mounted) {
    setMounted(true);
  }

  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useManualScrollAnchor({
    ref: containerRef,
    mounted,
    placeholderHeight: PLACEHOLDER_HEIGHT_PX,
  });

  useEffect(() => {
    if (mounted) {
      renderedSections.add(sectionId);
    }
  }, [mounted, sectionId]);

  useEffect(() => {
    if (mounted) return;
    const el = placeholderRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startTransition(() => setMounted(true));
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, sectionId]);

  if (mounted) {
    return <SectionContainer ref={containerRef}>{children}</SectionContainer>;
  } else {
    return <Placeholder ref={placeholderRef} {...{ [SECTION_ATTR]: sectionId }} />;
  }
}

// `children` is fresh JSX every render, so compare the `content` it carries
// instead — stable across navigation, but changes on an in-place data update
// (hot-reload), which a `sectionId`/`eager`-only check would miss, leaving
// stale content mounted.
export const LazySection = memo(LazySectionComponent, (prev, next) => {
  return (
    prev.sectionId === next.sectionId &&
    prev.eager === next.eager &&
    getRenderedContent(prev.children) === getRenderedContent(next.children)
  );
});

function getRenderedContent(children: ReactNode): unknown {
  return isValidElement(children) ? (children.props as { content?: unknown }).content : children;
}

const Placeholder = styled.div`
  min-height: var(--lazy-section-min-height, ${PLACEHOLDER_HEIGHT_PX}px);
  contain-intrinsic-size: var(--lazy-section-min-height, ${PLACEHOLDER_HEIGHT_PX}px);
  content-visibility: auto;
`;

const SectionContainer = styled.div`
  width: 100%;
  content-visibility: auto;
  contain-intrinsic-size: auto var(--lazy-section-min-height, ${PLACEHOLDER_HEIGHT_PX}px);
`;
