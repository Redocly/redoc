import { useEffect, useState } from 'react';
import * as React from 'react';

export default function RedoclyLogo(): JSX.Element | null {
  const [isDisplay, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(true);
  }, []);

  return isDisplay ? (
    <img
      alt={'redocly logo'}
      onError={() => setDisplay(false)}
      src={'https://cdn.redoc.ly/redoc/logo-mini.svg'}
    />
  ) : null;
}
