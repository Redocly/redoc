import { styled } from 'styled-components';
import { useState, useEffect } from 'react';

import type { ReactElement } from 'react';
import type { PayloadExamplesPanelItem } from '../../../types/content.js';

import { PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';

import { CodeBlockPanel } from '../styled.js';
import { useResolvedExamples, useExampleEntries } from '../../ItemContent/hooks.js';
import {
  useBodySamplingSchemaId,
  useSchemaVariantSelection,
  useMediaTypeContent,
} from './hooks.js';
import {
  VariantPicker,
  ExampleDescription,
  ExampleSelector,
  MediaTypeSelector,
  PayloadDisplay,
} from './selectors.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

export function PayloadExampleItem({ node }: { node: PayloadExamplesPanelItem }): ReactElement {
  const {
    mediaTypes,
    activeMediaType,
    effectiveSchemaId,
    effectiveExampleIds,
    encoding,
    isMessageWithoutPayload,
    onMediaTypeChange,
  } = useMediaTypeContent(node);
  const translate = useSpecTranslate();

  const discriminatorSelection = useSchemaVariantSelection(
    effectiveExampleIds?.length ? undefined : effectiveSchemaId,
  );
  const sampleSchemaId = useBodySamplingSchemaId(effectiveSchemaId, activeMediaType);
  const resolved = useResolvedExamples(
    sampleSchemaId,
    effectiveExampleIds,
    undefined,
    activeMediaType,
  );
  const generated = useResolvedExamples(sampleSchemaId, undefined, undefined, activeMediaType);
  const exampleEntries = useExampleEntries(effectiveExampleIds);
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);

  useEffect(() => setSelectedExampleIdx(0), [effectiveExampleIds, activeMediaType]);

  const selected =
    selectedExampleIdx < resolved.length ? resolved[selectedExampleIdx] : resolved[0];
  const payload = selected ?? generated[0];
  const activeExampleDescription = exampleEntries[selectedExampleIdx]?.description;
  const activeExampleHeaders = exampleEntries[selectedExampleIdx]?.headers;

  if (resolved.length === 0 && !isMessageWithoutPayload) {
    return <></>;
  }

  return (
    <CodeBlockPanel
      className="panel-response-samples"
      header={() => (
        <SamplesPanelHeader isExpandable={false}>
          {node.panelLabel ?? translate('payload', 'Payload')}
        </SamplesPanelHeader>
      )}
      isExpandable={false}
    >
      <MediaTypeSelector
        mediaTypes={mediaTypes}
        value={activeMediaType}
        onChange={onMediaTypeChange}
        label={translate('contentType', 'Payload media type')}
      />
      {!effectiveExampleIds?.length && <VariantPicker selection={discriminatorSelection} />}
      <ExampleSelector
        exampleIds={effectiveExampleIds}
        selectedIdx={selectedExampleIdx}
        onSelect={setSelectedExampleIdx}
      />
      <ExampleDescription description={activeExampleDescription} />
      {activeExampleHeaders && (
        <>
          <SampleLabel>{translate('header', 'Headers')}</SampleLabel>
          <PayloadDisplay payload={activeExampleHeaders} mediaType="application/json" />
          <SampleLabel>{translate('payload', 'Payload')}</SampleLabel>
        </>
      )}
      <PayloadDisplay
        payload={payload}
        emptyMessage="// No payload sample"
        mediaType={activeMediaType}
        encoding={encoding}
      />
    </CodeBlockPanel>
  );
}

const SampleLabel = styled.div`
  margin: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
`;

const SamplesPanelHeader = styled(PanelHeader)`
  font-weight: var(--font-weight-regular);
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xs);
`;
