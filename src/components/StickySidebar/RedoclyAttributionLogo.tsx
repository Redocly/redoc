import { useEffect, useState } from 'react';

import type { ReactElement } from 'react';

/** Redocly logo for the community edition's sidebar attribution. Hidden until mounted; removed if the CDN image fails to load. */
export function RedoclyAttributionLogo({ full = false }: { full?: boolean }): ReactElement | null {
  const [isDisplay, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(true);
  }, []);

  return isDisplay ? (
    <img
      alt="redocly logo"
      onError={() => setDisplay(false)}
      src={
        full
          ? 'https://cdn.redoc.ly/redoc/logo-mini-full.svg'
          : 'https://cdn.redoc.ly/redoc/logo-mini.svg'
      }
    />
  ) : null;
}
