import { useEffect, useState } from 'react';

export default function RedoclyLogo({ full = false }: { full?: boolean }) {
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
