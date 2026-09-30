import { useContext, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { DeepLinkSectionValue } from '../../../hooks/useDeepLinkSection.js';

import { buildAsyncApiSuffix, buildOpenApiFieldSuffix } from '../../../utils/deep-link.js';
import {
  DeepLinkSectionContext,
  ItemIdContext,
  useFieldDeepLinkUrl,
} from '../../../hooks/useDeepLinkSection.js';
import { expandableSectionAtom } from '../../../jotai/itemStore.js';

export function buildSchemaFieldSuffix(
  sectionCtx: DeepLinkSectionValue | null,
  fieldPath: string,
): string {
  if (!sectionCtx) return '';

  if (sectionCtx.pathOnly) {
    return fieldPath ? buildOpenApiFieldSuffix({ path: fieldPath }) : '';
  }
  if (sectionCtx.asyncSection) {
    let suffix = buildAsyncApiSuffix({
      section: sectionCtx.asyncSection,
      messageKey: sectionCtx.messageKey,
      subsection: sectionCtx.t,
    });
    if (fieldPath) {
      suffix += `&path=${fieldPath}`;
    }
    return suffix;
  }
  return buildOpenApiFieldSuffix({
    t: sectionCtx.t,
    in: sectionCtx.in,
    c: sectionCtx.c,
    cb: sectionCtx.cb,
    ct: sectionCtx.ct,
    path: fieldPath,
  });
}

export function useSchemaFieldDeepLink(fieldPath: string): string {
  const sectionCtx = useContext(DeepLinkSectionContext);
  const fieldSuffix = useMemo(
    () => buildSchemaFieldSuffix(sectionCtx, fieldPath),
    [sectionCtx, fieldPath],
  );
  return useFieldDeepLinkUrl(fieldSuffix);
}

export function useSectionBaselineKey(): string {
  const sectionCtx = useContext(DeepLinkSectionContext);
  return useMemo(() => buildSchemaFieldSuffix(sectionCtx, ''), [sectionCtx]);
}

export function useSectionExpandBaseline(): boolean | undefined {
  const itemId = useContext(ItemIdContext) ?? '';
  const baselineKey = useSectionBaselineKey();
  return useAtomValue(expandableSectionAtom(itemId, baselineKey));
}
