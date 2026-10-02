import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { CallbackPayloadPanelItem } from '../../../types/content.js';

import { CodeBlockPanel, StyledCodeBlock } from '../styled.js';
import { useResolvedExamples, useExampleEntries } from '../../ItemContent/hooks.js';
import { useBodySamplingSchemaId, useMediaTypeContent } from './hooks.js';
import {
  ExampleDescription,
  ExampleSelector,
  MediaTypeSelector,
  PayloadDisplay,
} from './selectors.js';
import { StyledPanelHeader } from './styled.js';
import { ServerDropdown } from './ServerDropdown.js';
import { LanguageDropdown } from '../LanguageItem/LanguageDropdown.js';
import { itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { getSyntaxHighlightLang } from '../../../utils/languages.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { useCopyCodeTelemetry } from '../../../hooks/useCopyCodeTelemetry.js';

const PAYLOAD_KEY = 'payload';

const ServerDropdownWrap = styled.div`
  min-width: 0;
  overflow: hidden;
  flex: 1 1 auto;
`;

export function CallbackPayloadItem({
  node,
}: {
  node: CallbackPayloadPanelItem;
}): ReactElement | null {
  const translate = useSpecTranslate();
  const itemId = useContext(ItemIdContext) ?? '';
  const selectedCallback = useAtomValue(itemStoreFieldAtom({ itemId, key: 'selectedCallback' }));
  const callbackName = node.callbackName;
  const definitionSamples = node.definitionSamples;

  const isVisible = callbackName != null && selectedCallback === callbackName;
  const { mediaTypes, activeMediaType, effectiveSchemaId, effectiveExampleIds, onMediaTypeChange } =
    useMediaTypeContent(node);

  const sampleSchemaId = useBodySamplingSchemaId(effectiveSchemaId, activeMediaType);
  const resolved = useResolvedExamples(
    sampleSchemaId,
    effectiveExampleIds,
    'response',
    activeMediaType,
  );
  const exampleEntries = useExampleEntries(effectiveExampleIds);
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
  const [activeKey, setActiveKey] = useState(PAYLOAD_KEY);

  useEffect(() => setSelectedExampleIdx(0), [effectiveExampleIds, activeMediaType]);

  const payload = resolved[selectedExampleIdx] ?? resolved[0];
  const activeExampleDescription = exampleEntries[selectedExampleIdx]?.description;

  const languages = useMemo(() => {
    const items: { key: string; lang: string; title: string }[] = [
      { key: PAYLOAD_KEY, lang: 'json', title: 'Payload' },
    ];
    if (definitionSamples) {
      for (const ds of definitionSamples) {
        const key = `x-${ds.lang}`;
        items.push({ key, lang: ds.lang, title: ds.label || ds.lang });
      }
    }
    return items;
  }, [definitionSamples]);

  const activeDefSample = useMemo(() => {
    if (activeKey === PAYLOAD_KEY || !definitionSamples) return undefined;
    return definitionSamples.find((ds) => `x-${ds.lang}` === activeKey);
  }, [activeKey, definitionSamples]);

  const onCopy = useCopyCodeTelemetry('response');

  const onLanguageSelect = useCallback((key: string) => setActiveKey(key), []);

  if (!isVisible) {
    return null;
  }

  return (
    <CodeBlockPanel
      className="panel-callback-samples"
      header={() => (
        <StyledPanelHeader isExpandable={false}>
          <ServerDropdownWrap>
            <ServerDropdown
              servers={node.servers ?? []}
              method={(node.httpVerb ?? 'post').toUpperCase()}
              path={node.path ?? 'Callback'}
            />
          </ServerDropdownWrap>
          <LanguageDropdown activeTab={activeKey} samples={languages} onChange={onLanguageSelect} />
        </StyledPanelHeader>
      )}
      isExpandable={false}
    >
      {activeDefSample ? (
        <StyledCodeBlock
          lang={getSyntaxHighlightLang(activeDefSample.lang)}
          source={activeDefSample.source}
          header={{
            className: 'code-block-header',
            controls: { copy: { onClick: onCopy(activeDefSample.lang) } },
          }}
        />
      ) : (
        <>
          <MediaTypeSelector
            mediaTypes={mediaTypes}
            value={activeMediaType}
            onChange={onMediaTypeChange}
            label={translate('contentType', 'Payload media type')}
          />
          <ExampleSelector
            exampleIds={effectiveExampleIds}
            selectedIdx={selectedExampleIdx}
            onSelect={setSelectedExampleIdx}
          />
          <ExampleDescription description={activeExampleDescription} />
          <PayloadDisplay
            payload={payload}
            emptyMessage="// No callback payload"
            mediaType={activeMediaType}
          />
        </>
      )}
    </CodeBlockPanel>
  );
}
