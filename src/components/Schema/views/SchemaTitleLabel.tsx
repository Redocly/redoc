import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';

import { globalOptionsAtom, schemaDefinitionSlugMapAtom } from '../../../jotai/store.js';
import { useNavigationUrlNormalizer } from '../../../hooks/useNormalizeUrl.js';
import { SchemaTitle, SchemaTypeLabel } from '../styled.js';

export function SchemaTitleLabel({
  title,
  schemaName,
}: {
  title?: string;
  schemaName?: string;
}): ReactElement | null {
  const { hideSchemaTitles, schemaDefinitionsTagName } = useAtomValue(globalOptionsAtom);
  const slugMap = useAtomValue(schemaDefinitionSlugMapAtom);
  const normalizeUrl = useNavigationUrlNormalizer();

  if (!title || hideSchemaTitles) return null;

  const label = `(${title})`;
  const slug = schemaDefinitionsTagName && schemaName ? slugMap[schemaName] : undefined;

  return slug ? (
    <SchemaTitle to={normalizeUrl(slug)}>{label}</SchemaTitle>
  ) : (
    <SchemaTypeLabel>{label}</SchemaTypeLabel>
  );
}
