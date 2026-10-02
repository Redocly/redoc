import { memo, startTransition, useLayoutEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import type { ReactNode } from 'react';

interface LazyMountProps {
  forceMount?: boolean;
  estimatedHeight?: number;
  children: ReactNode;
}

const PRELOAD_MARGIN_PX = 800;
const ROOT_MARGIN = `${PRELOAD_MARGIN_PX}px 0px`;

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) return false;

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.bottom >= 0 && rect.top <= viewportHeight;
}

function LazyMountComponent({ forceMount = false, estimatedHeight, children }: LazyMountProps) {
  const [visible, setVisible] = useState(forceMount);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (visible || forceMount) return;

    const el = placeholderRef.current;

    if (!el || typeof IntersectionObserver === 'undefined' || isInViewport(el)) {
      setVisible(true);

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startTransition(() => setVisible(true));
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [visible, forceMount]);

  if (visible || forceMount) {
    return <>{children}</>;
  }

  return (
    <Placeholder
      ref={placeholderRef}
      aria-hidden="true"
      style={estimatedHeight ? { minHeight: estimatedHeight } : undefined}
    />
  );
}

export const LazyMount = memo(LazyMountComponent);

const Placeholder = styled.div`
  min-height: var(--line-height-base, 24px);
`;
