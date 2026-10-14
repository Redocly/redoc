import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';

import { DeepLinkAnchor } from '../common/DeepLinkAnchor.js';
import { buildDeepLinkUrl, buildOpenApiSectionSuffix } from '../../utils/deep-link.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';
import { itemStoreFieldAtom } from '../../jotai/itemStore.js';

type ResponsesDeepLinkAnchorProps = {
  routingBasePath: string;
  relativePath: string;
  itemId: string;
  label: string;
};

export const ResponsesDeepLinkAnchor = memo(function ResponsesDeepLinkAnchor({
  routingBasePath,
  relativePath,
  itemId,
  label,
}: ResponsesDeepLinkAnchorProps): ReactElement {
  const normalizeUrl = useNavigationUrlNormalizer();
  const activeResponseCode = useAtomValue(
    itemStoreFieldAtom({ itemId, key: 'activeResponseCode' }),
  );
  const to = useMemo(() => {
    const suffix = activeResponseCode
      ? buildOpenApiSectionSuffix('responses', undefined, activeResponseCode)
      : 'responses';
    return normalizeUrl(buildDeepLinkUrl(routingBasePath, relativePath, suffix));
  }, [routingBasePath, relativePath, activeResponseCode, normalizeUrl]);
  return <DeepLinkAnchor to={to} label={label} />;
});
