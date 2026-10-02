import { useState, useMemo, useCallback, useContext, type ReactElement } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { CodeSamplePanelItem } from '../../../types/content.js';

import { applyEnvVariables } from '../../../services/code-samples/apply-env-variables.js';
import { findExampleIdByKey } from '../../../services/code-samples/example-key.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { CodeBlockPanel, StyledCodeBlock } from '../styled.js';
import { useResolvedExamples, useExampleKeyFromHash } from '../../ItemContent/hooks.js';
import { getLangKey, getSyntaxHighlightLang } from '../../../utils/languages.js';
import { exampleStoreAtom } from '../../../jotai/examples.js';
import {
  useActiveVariantSchemaId,
  useSchemaVariantSelection,
  useMediaTypeContent,
} from './hooks.js';
import { isSequentialMediaType } from '../../../utils/media-type.js';
import { isRecord } from '../../../adapters/helpers.js';
import { updateObjectProperties } from '../../../adapters/openapi/configure/merge-utils.js';
import { useCopyCodeTelemetry } from '../../../hooks/useCopyCodeTelemetry.js';
import {
  VariantPicker,
  ExampleDescription,
  ExampleSelector,
  MediaTypeSelector,
  PayloadDisplay,
} from './selectors.js';
import { LanguageDropdown } from '../LanguageItem/LanguageDropdown.js';
import { StyledPanelHeader } from './styled.js';
import { ServerDropdown } from './ServerDropdown.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { createLanguageSwitchEvent } from '../../../events/languageSwitch.js';
import { createCodeSampleCopyEvent } from '../../../events/codeSampleCopy.js';
import { useActiveServer } from './useActiveServer.js';
import { useCodeSampleLanguages, WEBHOOK_LANGUAGE_SAMPLES } from './useCodeSampleLanguages.js';

export function CodeSampleItem({ node }: { node: CodeSamplePanelItem }): ReactElement {
  const options = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const source = node.source;
  const exampleStore = useAtomValue(exampleStoreAtom);
  const { mediaTypes, activeMediaType, effectiveSchemaId, effectiveExampleIds, onMediaTypeChange } =
    useMediaTypeContent(node);

  const exampleContext = node.isWebhook ? 'response' : 'request';
  const discriminatorSelection = useSchemaVariantSelection(
    effectiveExampleIds?.length ? undefined : effectiveSchemaId,
  );
  const discAwareSchemaId = useActiveVariantSchemaId(effectiveSchemaId);
  const sampleSchemaId = isSequentialMediaType(activeMediaType)
    ? effectiveSchemaId
    : discAwareSchemaId;
  const resolved = useResolvedExamples(
    sampleSchemaId,
    effectiveExampleIds,
    exampleContext,
    activeMediaType,
  );
  const itemId = useContext(ItemIdContext) ?? '';
  const setItemState = useSetAtom(itemStoreAtom(itemId));
  const activeExampleKey = useAtomValue(itemStoreFieldAtom({ itemId, key: 'activeExampleKey' }));
  useExampleKeyFromHash(itemId, effectiveExampleIds);



  const contentKey = `${activeMediaType}|${effectiveExampleIds?.join(',')}`;
  const keyedId = findExampleIdByKey(
    effectiveExampleIds,
    activeExampleKey || undefined,
    (id) => exampleStore[id],
  );
  const keyedIdx = keyedId ? (effectiveExampleIds?.indexOf(keyedId) ?? -1) : -1;
  // A key this panel doesn't have leaves the selection alone; only a change of
  // the panel's own example list resets it.
  const [lastSelection, setLastSelection] = useState({ contentKey, idx: 0 });
  const selectedExampleIdx =
    keyedIdx >= 0 ? keyedIdx : lastSelection.contentKey === contentKey ? lastSelection.idx : 0;
  if (lastSelection.idx !== selectedExampleIdx || lastSelection.contentKey !== contentKey) {
    setLastSelection({ contentKey, idx: selectedExampleIdx });
  }

  const onExampleSelect = useCallback(
    (idx: number) => {
      setLastSelection({ contentKey, idx });
      const id = effectiveExampleIds?.[idx];
      const key = id ? exampleStore[id]?.key : undefined;
      // A keyless (generated) example clears the shared key — there is nothing
      // another panel could match it by.
      setItemState({ activeExampleKey: key ?? '' });
    },
    [contentKey, effectiveExampleIds, exampleStore, setItemState],
  );

  const payload = resolved[selectedExampleIdx] ?? resolved[0];
  const hasPayloadData = (effectiveExampleIds?.length ?? 0) > 0 || !!effectiveSchemaId;

  const { languages, filteredDefinitionSamples, activeLanguage, setLanguage } =
    useCodeSampleLanguages(node, hasPayloadData);
  const activeServer = useActiveServer(node);


  const selectedExampleId = effectiveExampleIds?.[selectedExampleIdx];
  const activeExampleName = selectedExampleId
    ? (exampleStore[selectedExampleId]?.key ?? selectedExampleId)
    : undefined;


  const configuredBody = useMemo(() => {
    const serverBody = source.requestValues?.serverBody;
    return (
      (activeServer.specUrl && serverBody?.[activeServer.specUrl]) ?? source.requestValues?.body
    );
  }, [activeServer.specUrl, source.requestValues?.body, source.requestValues?.serverBody]);

  const payloadForDisplay = useMemo(() => {
    if (configuredBody !== undefined) {
      if (payload === undefined) return configuredBody;
      if (isRecord(payload) && isRecord(configuredBody)) {
        return updateObjectProperties(payload, configuredBody);
      }
      return configuredBody;
    }
    return payload;
  }, [
    payload,
    configuredBody,
  ]);

  const code = useMemo(() => {
    if (activeLanguage === 'payload') return '';

    const defSample = filteredDefinitionSamples?.find((ds) => getLangKey(ds) === activeLanguage);
    if (defSample) {
      return applyEnvVariables(defSample.source, source.requestValues, activeServer.specUrl);
    }

    let generated: string | undefined;
    return generated ?? `// ${translate('unsupportedLanguage', 'Language is not supported.')}`;
  }, [
    activeLanguage,
    filteredDefinitionSamples,
    source,
    activeServer,
    translate,
  ]);

  const activeLang = languages.find((l) => l.key === activeLanguage) ?? languages[0];
  const defSampleForLang = node.definitionSamples?.find((ds) => getLangKey(ds) === activeLanguage);
  const activeSampleLang = defSampleForLang?.lang ?? activeLang?.lang;
  const highlightLang = activeSampleLang && getSyntaxHighlightLang(activeSampleLang);
  const onCopyTelemetry = useCopyCodeTelemetry('request');
  const onCopy = useCallback(
    (lang?: string) => () => {
      onCopyTelemetry(lang)();
      options.events?.codeSamplesCopy?.(
        createCodeSampleCopyEvent({
          operation: {
            id: `${source.method}:${source.path}`,
            path: source.path,
            httpVerb: source.method,
            name: `${source.method.toUpperCase()} ${source.path}`,
          },
          type: 'request',
          lang: lang ?? '',
          label: activeLang?.title ?? '',
          activeMimeName: activeMediaType ?? '',
          activeExampleName,
        }),
      );
    },
    [
      onCopyTelemetry,
      options.events,
      source.method,
      source.path,
      activeLang,
      activeMediaType,
      activeExampleName,
    ],
  );

  const onLanguageSelect = useCallback(
    (key: string) => {
      setLanguage(key);
      const selected = (node.isWebhook ? WEBHOOK_LANGUAGE_SAMPLES : languages).find(
        (l) => l.key === key,
      );
      if (options.events?.codeSamplesLanguageSwitch && selected) {
        options.events.codeSamplesLanguageSwitch(
          createLanguageSwitchEvent({
            operation: {
              id: `${source.method}:${source.path}`,
              path: source.path,
              httpVerb: source.method,
              name: `${source.method.toUpperCase()} ${source.path}`,
            },
            sample: { lang: selected.lang, label: selected.title },
          }),
        );
      }
    },
    [setLanguage, languages, node.isWebhook, options.events, source.method, source.path],
  );

  const method = source.method;
  const path = source.path;
  const isPayloadView = activeLanguage === 'payload';
  // Custom `x-codeSamples` are static strings — the discriminator dropdown
  // can't influence them, so hide it to avoid misleading users into thinking
  // their selection is being applied.
  const hasCustomCodeSample = !isPayloadView && Boolean(defSampleForLang);
  const hasSpecExamples = (effectiveExampleIds?.length ?? 0) > 0;

  return (
    <>
      <CodeBlockPanel
        className="panel-request-samples"
        header={() => (
          <StyledPanelHeader isExpandable={false}>
            <ServerDropdown servers={node.servers ?? []} method={method} path={path} />
            <LanguageDropdown
              activeTab={activeLanguage}
              samples={node.isWebhook ? WEBHOOK_LANGUAGE_SAMPLES : languages}
              onChange={onLanguageSelect}
            />
          </StyledPanelHeader>
        )}
        isExpandable={false}
      >
        {mediaTypes.length > 1 && (
          <MediaTypeSelector
            mediaTypes={mediaTypes}
            value={activeMediaType}
            onChange={onMediaTypeChange}
            label={
              isPayloadView
                ? translate('contentType', 'Payload media type')
                : translate('contentType', 'Request media type')
            }
          />
        )}
        {!hasCustomCodeSample && !hasSpecExamples && (
          <VariantPicker selection={discriminatorSelection} />
        )}
        <ExampleSelector
          exampleIds={effectiveExampleIds}
          selectedIdx={selectedExampleIdx}
          onSelect={onExampleSelect}
        />
        <ExampleDescription description={exampleStore[selectedExampleId ?? '']?.description} />
        {isPayloadView ? (
          <PayloadDisplay
            payload={payloadForDisplay}
            emptyMessage={`// ${translate('noRequestPayload', 'No request payload')}`}
            mediaType={activeMediaType}
            snippetType="request"
          />
        ) : (
          <StyledCodeBlock
            lang={highlightLang}
            source={code}
            header={{
              className: 'code-block-header',
              controls: { copy: { onClick: onCopy(activeSampleLang) } },
            }}
          />
        )}
      </CodeBlockPanel>
    </>
  );
}
