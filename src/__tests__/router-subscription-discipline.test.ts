import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// `useLocation()` re-renders its caller on every URL change. Per-item components must read
// `useUrlHash()` or an atom written by a root tracker instead.
const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Root subscribers: each one is mounted once per page.
const ROOT_SUBSCRIBERS = [
  'hooks/useApiDocsScroll.ts',
  'hooks/useInitialTelemetry.ts',
  'hooks/usePageViewTelemetry.ts',
  'hooks/useRouterHashBridge.ts',
  'hooks/useScrollSpyUrlSync.ts',
  'hooks/useVisitedChannelsTracker.ts',
  'pages/EntryPage.tsx',
];
// Known exceptions. useIsExpanded runs once per group entry; remove it from this list when it
// reads an atom instead.
const KNOWN_EXCEPTIONS = [
  'components/SideMenu/useMenuItems.ts',
  'hooks/useIsExpanded.ts',
  'pages/NotFoundPage.tsx',
];
const ALLOWED = new Set([...ROOT_SUBSCRIBERS, ...KNOWN_EXCEPTIONS]);

const callsUseLocation = (source: string): boolean =>
  source.split('\n').some((line) => {
    const code = line.trim();
    return !/^(\/\/|\/?\*)/.test(code) && code.includes('useLocation()');
  });

describe('router subscriptions', () => {
  it('call useLocation() only from the sanctioned root subscribers', () => {
    const files = readdirSync(SRC, { recursive: true, encoding: 'utf-8' }).filter(
      (file) => /\.tsx?$/.test(file) && !file.includes('__tests__'),
    );
    const offenders = files.filter(
      (file) =>
        !ALLOWED.has(file.replace(/\.ce(\.tsx?)$/, '$1')) &&
        callsUseLocation(readFileSync(resolve(SRC, file), 'utf-8')),
    );
    expect(offenders).toEqual([]);
  });
});
