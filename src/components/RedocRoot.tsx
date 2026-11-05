import { useAtomValue } from 'jotai';

import type { PropsWithChildren, ReactElement } from 'react';

import { REDOC_ROOT_CLASS, colorModeAtom } from '../jotai/color-mode.js';

export function useRedocRootClassName(): string {
  return `${REDOC_ROOT_CLASS} ${useAtomValue(colorModeAtom)}`;
}

export function RedocRoot({ children }: PropsWithChildren): ReactElement {
  return (
    <div className={useRedocRootClassName()} suppressHydrationWarning>
      {children}
    </div>
  );
}
