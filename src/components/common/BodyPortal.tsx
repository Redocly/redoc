// Redoc CE runs inside host pages. Content rendered into `document.body`, such as dialogs and
// tooltips, sits outside the Redoc root and would take the host page's fonts and colors, so these
// wrappers mount it in a `.redoc` root that follows the current color mode.

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';

import type { PropsWithChildren, ReactElement, ReactPortal } from 'react';

import { PortalContainerContext } from '@redocly/theme/core/contexts/PortalContainerContext';

import { RedocRoot, useRedocRootClassName } from '../RedocRoot.js';
import { useIsHydrated } from '../../hooks/useIsHydrated.js';

export function BodyPortal({ children }: PropsWithChildren): ReactPortal {
  return createPortal(
    <RedocRoot>
      <NestedPortalScope>{children}</NestedPortalScope>
    </RedocRoot>,
    document.body,
  );
}

export function NestedPortalScope({ children }: PropsWithChildren): ReactElement {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <>
      <PortalContainerContext.Provider value={container}>
        {children}
      </PortalContainerContext.Provider>
      <div ref={setContainer} />
    </>
  );
}

export function PortalScope({ children }: PropsWithChildren): ReactElement {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const className = useRedocRootClassName();
  const hydrated = useIsHydrated();
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
      {hydrated && createPortal(<Layer ref={setContainer} className={className} />, document.body)}
    </PortalContainerContext.Provider>
  );
}

const Layer = styled.div`
  display: contents;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;
