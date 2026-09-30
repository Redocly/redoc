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
  const { mediaTypes, activeMediaType, effectiveSchemaId, effectiveExampleIds, onMediaTypeChange } =
    useMediaTypeContent(node);
  const translate = useSpecTranslate();

  const discriminatorSelection = useSchemaVariantSelection(
    effectiveExampleIds?.length ? undefined : effectiveSchemaId,
  );
  const sampleSchemaId = useBodySamplingSchemaId(effectiveSchemaId, activeMediaType);
  const resolved = useResolvedExamples(
    sampleSchemaId,
    effectiveExampleIds,
    'response',
    activeMediaType,
  );
  const exampleEntries = useExampleEntries(effectiveExampleIds);
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);

  useEffect(() => setSelectedExampleIdx(0), [effectiveExampleIds, activeMediaType]);

  const payload = resolved[selectedExampleIdx] ?? resolved[0];
  const activeExampleDescription = exampleEntries[selectedExampleIdx]?.description;

  if (resolved.length === 0) {
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
      <PayloadDisplay
        payload={payload}
        emptyMessage="// No payload sample"
        mediaType={activeMediaType}
      />
    </CodeBlockPanel>
  );
}

const SamplesPanelHeader = styled(PanelHeader)`
  font-weight: var(--font-weight-regular);
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xs);
`;
