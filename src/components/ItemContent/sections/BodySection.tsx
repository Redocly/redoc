import { useContext, useMemo, memo } from 'react';
import { styled } from 'styled-components';
import { useAtom, useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';
import type { DeepLinkSectionValue } from '../../../hooks/useDeepLinkSection.js';

import { Markdown } from '../../common/Markdown.js';
import { schemaEntryAtom } from '../../../jotai/schema.js';
import { activeMediaTypeAtom } from '../../../jotai/app.js';
import { SchemaView } from '../../Schema/SchemaView.js';
import { buildOpenApiSectionSuffix, getDeepLinkId } from '../../../utils/deep-link.js';
import {
  DeepLinkSectionContext,
  ItemIdContext,
  useCallbackScope,
  useDeepLinkUrl,
} from '../../../hooks/useDeepLinkSection.js';
import { BodyMimeTypeField } from './BodyMimeTypeField.js';
import { useMediaTypeFromHash } from '../hooks.js';

function BodySectionComponent({ node }: { node: ItemContentNode }): ReactElement {
  const mediaTypes = node.mediaTypeSchemas ? Object.keys(node.mediaTypeSchemas) : node.mediaTypes;
  const [activeMediaType, setActiveMediaType] = useAtom(activeMediaTypeAtom);
  const itemId = useContext(ItemIdContext);
  useMediaTypeFromHash(itemId ?? undefined, mediaTypes);

  const currentMediaType =
    activeMediaType && mediaTypes?.includes(activeMediaType) ? activeMediaType : mediaTypes?.[0];

  const mediaTypeEntry = node.mediaTypeSchemas?.[currentMediaType ?? ''];
  const activeSchemaId = mediaTypeEntry?.schemaId ?? node.schemaId;
  const schemaEntry = useAtomValue(schemaEntryAtom(activeSchemaId ?? ''));

  const hasMediaTypes = mediaTypes && mediaTypes.length > 0;
  const hasMultiple = mediaTypes && mediaTypes.length > 1;
  const isRequestVariant =
    node.variant === 'querystring-body' || (node.variant === 'body' && !node.isEvent);

  const bodySuffix = useMemo(() => buildOpenApiSectionSuffix('request', 'body'), []);
  const deepLink = useDeepLinkUrl(bodySuffix);

  const callbackScope = useCallbackScope();
  const sectionData = useMemo<DeepLinkSectionValue>(
    () => ({
      t: 'request',
      cb: callbackScope,
      ct: hasMultiple ? currentMediaType : undefined,
    }),
    [callbackScope, hasMultiple, currentMediaType],
  );

  return (
    <BodyWrapper id={getDeepLinkId(deepLink)}>
      {hasMediaTypes && mediaTypes && (
        <BodyMimeTypeField
          mediaTypes={mediaTypes}
          value={currentMediaType}
          onChange={setActiveMediaType}
          deepLink={deepLink}
          required={node.required}
        />
      )}
      {node.description ? (
        <BodyDescription>
          <Markdown source={node.description} />
        </BodyDescription>
      ) : null}
      {schemaEntry && (
        <DeepLinkSectionContext.Provider value={sectionData}>
          <SchemaView
            schemaId={activeSchemaId}
            expandByDefault
            level={1}
            skipReadOnly={isRequestVariant}
            skipWriteOnly={!isRequestVariant}
          />
        </DeepLinkSectionContext.Provider>
      )}
    </BodyWrapper>
  );
}

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyDescription = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-description);

  p {
    margin-top: var(--spacing-xxs);
    margin-bottom: 0;
  }
`;

export const BodySection = memo(BodySectionComponent);
