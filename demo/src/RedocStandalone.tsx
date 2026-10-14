import { useEffect, useRef } from 'react';

import { loadRedoc, type RedocRoot } from './redoc';

type RedocStandaloneProps = {
  spec: string | object;
  basePath: string;
  onSettled?: () => void;
};

const scrollYOffset = () =>
  document.querySelector('nav.demo-nav')?.getBoundingClientRect().height ?? 0;

export default function RedocStandalone({ spec, basePath, onSettled }: RedocStandaloneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    onSettledRef.current = onSettled;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const container = document.createElement('div');
    host.appendChild(container);

    const observer = new MutationObserver(() => {
      if (container.childElementCount > 0) {
        observer.disconnect();
        onSettledRef.current?.();
      }
    });
    observer.observe(container, { childList: true });

    let root: RedocRoot | undefined;
    let cancelled = false;

    loadRedoc()
      .then((redoc) => {
        if (cancelled) return;
        root = redoc.init(
          spec,
          { router: 'history', basePath, sanitize: true, hideLoading: true, scrollYOffset },
          container,
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        observer.disconnect();
        container.textContent = 'Failed to load API docs: ' + (err as Error).message;
        onSettledRef.current?.();
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      root?.unmount();
      if (container.parentNode === host) host.removeChild(container);
    };
  }, [spec, basePath]);

  return <div ref={hostRef} />;
}
