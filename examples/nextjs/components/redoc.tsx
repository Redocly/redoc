'use client';

import dynamic from 'next/dynamic';

import type { RedocStandaloneProps } from 'redoc';

const RedocStandalone = dynamic(() => import('redoc').then((mod) => mod.RedocStandalone), {
  ssr: false,
  loading: () => <p style={{ padding: 16 }}>Loading API reference…</p>,
});

export function Redoc(props: Pick<RedocStandaloneProps, 'specUrl' | 'basePath'>) {
  return <RedocStandalone {...props} />;
}
