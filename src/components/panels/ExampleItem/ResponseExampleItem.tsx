import { useState, useMemo, useCallback, useContext, type ReactElement } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { ResponseCodeEntry, ResponseExamplesPanelItem } from '../../../types/content.js';
import type { ExampleEntry } from '../../../types/store.js';

import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { CodeBlockPanel } from '../styled.js';
import { findExampleIdByKey } from '../../../services/code-samples/example-key.js';
import {
  useResolvedExamples,
  useExampleEntries,
  useExampleKeyFromHash,
} from '../../ItemContent/hooks.js';
import { useBodySamplingSchemaId, useSchemaVariantSelection } from './hooks.js';
import { activeMediaTypeAtom } from '../../../jotai/app.js';
import { exampleStoreAtom } from '../../../jotai/examples.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import {
  VariantPicker,
  ExampleDescription,
  ExampleSelector,
  MediaTypeSelector,
  PayloadDisplay,
} from './selectors.js';
import { ResponsePanelHeader } from './styled.js';
import { ResponseCodesTabList, ResponseCodeTab } from '../../common/ResponseCodeTabs.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { RESOURCES, statusClassOf, useTelemetry } from '../../../telemetry/index.js';

// Finds the response code (and media type) whose examples contain `key`, so the
// panel can pre-select the response the keyed example belongs to.
function findKeyedExample(
  responseCodes: ResponseCodeEntry[] | undefined,
  key: string | undefined,
  exampleStore: Record<string, ExampleEntry>,
): { code: string; mediaType?: string } | undefined {
  if (key === undefined || !responseCodes?.length) return undefined;
  const resolve = (id: string): ExampleEntry | undefined => exampleStore[id];
  for (const entry of responseCodes) {
    for (const [mediaType, content] of Object.entries(entry.mediaTypeContent ?? {})) {
      if (findExampleIdByKey(content.exampleIds, key, resolve)) {
        return { code: entry.code, mediaType };
      }
    }
    if (findExampleIdByKey(entry.exampleIds, key, resolve)) {
      return { code: entry.code };
    }
  }
  return undefined;
}

export function ResponseExampleItem({ node }: { node: ResponseExamplesPanelItem }): ReactElement {
  const { responseCodes } = node;
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();
  const itemId = useContext(ItemIdContext) ?? '';
  const setItemState = useSetAtom(itemStoreAtom(itemId));
  const selectCode = useCallback(
    (code: string): void => {
      telemetry.sendResponseCodeTabClickedMessage([
        {
          ...RESOURCES.responseCodeTab,
          statusClass: statusClassOf(code),
          total: responseCodes?.length ?? 0,
        },
      ]);
      setItemState({ activeResponseCode: code });
    },
    [telemetry, responseCodes?.length, setItemState],
  );
  const storedCode = useAtomValue(itemStoreFieldAtom({ itemId, key: 'activeResponseCode' }));
  const activeExampleKey = useAtomValue(itemStoreFieldAtom({ itemId, key: 'activeExampleKey' }));
  const exampleStore = useAtomValue(exampleStoreAtom);
  const keyedExample = useMemo(
    () => findKeyedExample(responseCodes, node.exampleKey, exampleStore),
    [responseCodes, node.exampleKey, exampleStore],
  );
  const activeCode = storedCode || keyedExample?.code || responseCodes?.[0]?.code;

  const activeResponseData =
    responseCodes?.find((r) => r.code === activeCode) ?? responseCodes?.[0];

  const responseMediaTypes = useMemo(
    () =>
      activeResponseData?.mediaTypeContent
        ? Object.keys(activeResponseData.mediaTypeContent)
        : (activeResponseData?.mediaTypes ?? []),
    [activeResponseData],
  );

  const [globalMediaType, setGlobalMediaType] = useAtom(activeMediaTypeAtom);
  const [userPickedMediaType, setUserPickedMediaType] = useState(false);
  const keyedMediaType =
    keyedExample &&
    keyedExample.code === activeCode &&
    keyedExample.mediaType &&
    responseMediaTypes.includes(keyedExample.mediaType)
      ? keyedExample.mediaType
      : undefined;
  // An authored exampleKey (set only on embeds) beats the persisted global
  // media type until the user switches media type in this panel.
  const activeMediaType =
    !userPickedMediaType && keyedMediaType
      ? keyedMediaType
      : globalMediaType && responseMediaTypes.includes(globalMediaType)
        ? globalMediaType
        : (keyedMediaType ?? responseMediaTypes[0]);

  const activeContent = activeResponseData?.mediaTypeContent?.[activeMediaType ?? ''];
  // Node-level schemaId/exampleIds are only meaningful on codeless RESPONSE panels;
  // per-code panels carry all sample data inside responseCodes entries, so never
  // let a node-level aggregate leak into a code that defines no content.
  const hasResponseCodes = Boolean(responseCodes?.length);
  const effectiveSchemaId =
    activeContent?.schemaId ??
    activeResponseData?.schemaId ??
    (hasResponseCodes ? undefined : node.schemaId);
  const activeExampleIds =
    activeContent?.exampleIds ??
    activeResponseData?.exampleIds ??
    (hasResponseCodes ? undefined : node.exampleIds);
  useExampleKeyFromHash(itemId, activeExampleIds);
  // Legacy hasSample parity: a media type without schema or examples is "No content".
  const activeCodeHasContent =
    !responseCodes?.length || Boolean(effectiveSchemaId || activeExampleIds?.length);

  const resolvedMediaType =
    responseMediaTypes.length > 0 ? (activeMediaType ?? responseMediaTypes[0]) : 'application/json';

  const discriminatorSelection = useSchemaVariantSelection(
    activeExampleIds?.length ? undefined : effectiveSchemaId,
  );
  const sampleSchemaId = useBodySamplingSchemaId(effectiveSchemaId, resolvedMediaType);
  const resolved = useResolvedExamples(
    sampleSchemaId,
    activeExampleIds,
    node.isEvent ? 'request' : 'response',
    resolvedMediaType,
  );
  const exampleEntries = useExampleEntries(activeExampleIds);
  const contentKey = `${activeCode}|${activeMediaType}|${activeExampleIds?.join(',')}`;
  const storeKeyedId = findExampleIdByKey(
    activeExampleIds,
    activeExampleKey || undefined,
    (id) => exampleStore[id],
  );
  const storeIdx = storeKeyedId ? (activeExampleIds?.indexOf(storeKeyedId) ?? -1) : -1;
  const authoredKeyedId = findExampleIdByKey(
    activeExampleIds,
    node.exampleKey,
    (id) => exampleStore[id],
  );
  const authoredIdx = authoredKeyedId ? (activeExampleIds?.indexOf(authoredKeyedId) ?? -1) : -1;
  // The shared key (a selection made anywhere in the operation) wins; then this
  // panel's own explicit pick, remembered per response code/media type; then the
  // authored embed exampleKey. A key this panel doesn't have leaves the
  // selection alone.
  const [selections, setSelections] = useState<Record<string, { idx: number; picked: boolean }>>(
    {},
  );
  const lastSelection = selections[contentKey];
  const selectedExampleIdx =
    storeIdx >= 0
      ? storeIdx
      : lastSelection?.picked
        ? lastSelection.idx
        : authoredIdx >= 0
          ? authoredIdx
          : (lastSelection?.idx ?? 0);
  if (!lastSelection || lastSelection.idx !== selectedExampleIdx) {
    const picked = lastSelection?.picked ?? false;
    setSelections((prev) => ({ ...prev, [contentKey]: { idx: selectedExampleIdx, picked } }));
  }

  const onExampleSelect = useCallback(
    (idx: number) => {
      setSelections((prev) => ({ ...prev, [contentKey]: { idx, picked: true } }));
      const id = activeExampleIds?.[idx];
      const key = id ? exampleStore[id]?.key : undefined;
      // A keyless (generated) example clears the shared key — there is nothing
      // another panel could match it by.
      setItemState({ activeExampleKey: key ?? '' });
    },
    [contentKey, activeExampleIds, exampleStore, setItemState],
  );

  const payload = resolved[selectedExampleIdx] ?? resolved[0];
  const activeExampleDescription = exampleEntries[selectedExampleIdx]?.description;

  const renderHeader = useCallback(() => {
    if (node.hideHeaderTitle && !responseCodes?.length) return;
    return (
      <ResponsePanelHeader>
        {!node.hideHeaderTitle && (
          <PanelHeaderTitle>{translate('response', 'Response')}</PanelHeaderTitle>
        )}
        {responseCodes && responseCodes.length > 0 && (
          <ResponseCodesTabList>
            {responseCodes.map((r) => {
              const isActive = r.code === (activeCode ?? responseCodes[0]?.code);
              return (
                <ResponseCodeTab
                  key={r.code}
                  type="button"
                  $active={isActive}
                  $code={r.code}
                  onClick={() => selectCode(r.code)}
                >
                  {r.code}
                </ResponseCodeTab>
              );
            })}
          </ResponseCodesTabList>
        )}
      </ResponsePanelHeader>
    );
  }, [responseCodes, activeCode, node.hideHeaderTitle, translate, selectCode]);

  if (resolved.length === 0 && !responseCodes?.length) {
    return <></>;
  }

  return (
    <CodeBlockPanel className="panel-response-samples" header={renderHeader} isExpandable={false}>
      <MediaTypeSelector
        mediaTypes={responseMediaTypes}
        value={activeMediaType}
        onChange={(mediaType) => {
          setUserPickedMediaType(true);
          setGlobalMediaType(mediaType);
        }}
        label={translate('contentType', 'Response media type')}
      />
      {!activeExampleIds?.length && <VariantPicker selection={discriminatorSelection} />}
      <ExampleSelector
        exampleIds={activeExampleIds}
        selectedIdx={selectedExampleIdx}
        onSelect={onExampleSelect}
      />
      <ExampleDescription description={activeExampleDescription} />
      <PayloadDisplay
        payload={payload}
        emptyMessage={
          activeCodeHasContent
            ? `// ${translate('noResponseExample', 'No response sample')}`
            : translate('noResponseContent', 'No content')
        }
        mediaType={resolvedMediaType}
      />
    </CodeBlockPanel>
  );
}
