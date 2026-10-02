import type { JSX } from 'react';

import { PageActions } from './PageActions.js';

export function HeaderPageActions({ pageSlug }: { pageSlug: string }): JSX.Element | null {
  return <PageActions pageSlug={pageSlug} />;
}
