import { useContext, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { ReactElement } from 'react';
import type { Node } from '@markdoc/markdoc';
import type { ItemContentNode } from '../../../types/content.js';
import type { DeepLinkSectionValue } from '../../../hooks/useDeepLinkSection.js';

import { SchemaView } from '../../Schema/SchemaView.js';
import { Markdown } from '../../common/Markdown.js';
import { DeepLinkAnchor, deepLinkHoverReveal } from '../../common/DeepLinkAnchor.js';
import { getDeepLinkId } from '../../../utils/deep-link.js';
import { BodyMimeTypeField } from './BodyMimeTypeField.js';
import { activeMediaTypeAtom } from '../../../jotai/app.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import {
  DeepLinkSectionContext,
  ItemIdContext,
  useCallbackScope,
} from '../../../hooks/useDeepLinkSection.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { isRecord } from '../../../adapters/helpers.js';
import { useKeyFromHash, useMediaTypeFromHash, useResponseSectionDeepLink } from '../hooks.js';
import { useUrlHashReassert } from '../../../hooks/useUrlHashReassert.js';

export function ResponsesSection({ node }: { node: ItemContentNode }): ReactElement {
  const responses = node.responses;
  const translate = useSpecTranslate();
  const itemId = useContext(ItemIdContext);
  const storedCode = useAtomValue(
    itemStoreFieldAtom({ itemId: itemId ?? '', key: 'activeResponseCode' }),
  );
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));
  const responseCodes = useMemo(() => responses?.map((r) => r.code), [responses]);
  const codeFromUrl = useKeyFromHash(itemId ?? undefined, responseCodes, 'c');
  const reassert = useUrlHashReassert();

  const activeCode = storedCode || codeFromUrl || responses?.[0]?.code || '';

  useEffect(() => {
    if (codeFromUrl) {
      setItemState({ activeResponseCode: codeFromUrl });
    }
  }, [codeFromUrl, setItemState, reassert]);

  const bodyDeepLink = useResponseSectionDeepLink(activeCode, 'body');
  const headersDeepLink = useResponseSectionDeepLink(activeCode, 'headers');
  const {
    mediaTypes: responseMediaTypes,
    mediaType,
    mediaTypeContent,
    schemaId,
    summary,
    description,
    headers,
    headerSchemaId,
  } = responses?.find((r) => r.code === activeCode) ?? responses?.[0] ?? {};

  const mediaTypes = mediaTypeContent
    ? Object.keys(mediaTypeContent)
    : (responseMediaTypes ?? (mediaType ? [mediaType] : []));
  const [activeMediaType, setActiveMediaType] = useAtom(activeMediaTypeAtom);
  useMediaTypeFromHash(itemId ?? undefined, mediaTypes);

  const currentMediaType =
    activeMediaType && mediaTypes.includes(activeMediaType) ? activeMediaType : mediaTypes[0];

  const activeSchemaId = mediaTypeContent?.[currentMediaType]?.schemaId ?? schemaId;

  const callbackScope = useCallbackScope();
  const sectionData = useMemo<DeepLinkSectionValue>(
    () => ({
      t: 'response',
      c: activeCode,
      cb: callbackScope,
      ct: mediaTypes.length > 1 ? currentMediaType : undefined,
    }),
    [activeCode, callbackScope, mediaTypes.length, currentMediaType],
  );

  if (!responses || responses.length === 0) {
    return <></>;
  }

  return (
    <ResponseWrapper>
      <ResponseContent>
        {summary && (
          <ResponseDescription>
            <Markdown source={summary} />
          </ResponseDescription>
        )}
        {description && (
          <ResponseDescription>
            <Markdown source={description as Node | Node[]} />
          </ResponseDescription>
        )}
        <DeepLinkSectionContext.Provider value={sectionData}>
          {(headerSchemaId || isRecord(headers)) && (
            <HeadersWrapper>
              <BodyHeading id={getDeepLinkId(headersDeepLink)}>
                {headersDeepLink && (
                  <DeepLinkAnchor
                    to={headersDeepLink}
                    label={`link to ${translate('header', 'Headers')}`}
                  />
                )}
                <BodyLabel>{translate('header', 'Headers')}</BodyLabel>
              </BodyHeading>
              {headerSchemaId ? (
                <SchemaView schemaId={headerSchemaId} expandByDefault level={1} />
              ) : (
                <SchemaView schema={headers} expandByDefault level={1} />
              )}
            </HeadersWrapper>
          )}
          {mediaTypes.length > 0 && (
            <BodyMimeTypeField
              headingId={getDeepLinkId(bodyDeepLink)}
              mediaTypes={mediaTypes}
              value={currentMediaType}
              onChange={setActiveMediaType}
              deepLink={bodyDeepLink}
            />
          )}
          {activeSchemaId && (
            <SchemaView schemaId={activeSchemaId} expandByDefault level={1} skipWriteOnly />
          )}
        </DeepLinkSectionContext.Provider>
      </ResponseContent>
    </ResponseWrapper>
  );
}

const ResponseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const ResponseContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResponseDescription = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-description);
`;

const BodyHeading = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: var(--spacing-md);
  padding: var(--spacing-xxs) 0;
  ${deepLinkHoverReveal}
`;

const BodyLabel = styled.span`
  font-weight: var(--font-weight-semibold);
  font-size: 18px;
  line-height: var(--line-height-lg);
  color: var(--text-color-primary);
`;

const HeadersWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: var(--spacing-lg);
  }
`;
