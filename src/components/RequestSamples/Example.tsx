import { memo } from 'react';
import { useAtom } from 'jotai';

import type { ReactElement } from 'react';
import type { MediaContentModel, MediaTypeModel } from '../../models/index.js';

import { ExampleSwitch, useExampleKey } from '../Samples/index.js';
import { useActivateExample, useTelemetry } from '../../hooks/index.js';
import { operationStore } from '../../jotai/operation.js';

interface ExampleProps {
  mediaType: MediaTypeModel;
  mediaContent: MediaContentModel;
  renderSample: (exampleName?: string) => ReactElement;
}

function ExampleComponent({ mediaType, mediaContent, renderSample }: ExampleProps): ReactElement {
  const telemetry = useTelemetry();
  const pointer = mediaType.operation.pointer;
  const [operation, setOperation] = useAtom(operationStore(pointer));
  const examples = mediaType.examples || {};
  const examplesKeys = Object.keys(examples);
  const setActivateExampleName = useActivateExample(mediaContent);

  const { exampleKey } = useExampleKey(mediaType.operation, examples);

  if (!examplesKeys.length || examplesKeys.length === 1) {
    return renderSample();
  }

  const handleExampleChange = (key: string) => {
    telemetry.sendExamplesSwitcherClickedMessage({
      exampleNumber: examplesKeys.indexOf(key),
      totalExamples: examplesKeys.length,
    });
    setOperation({
      ...operation,
      activeExampleName: key,
      activeOneOf: { [pointer]: examplesKeys.indexOf(key) },
      requestValues: { body: null },
    });
    setActivateExampleName(key);
  };

  return (
    <>
      <ExampleSwitch examples={examples} exampleKey={exampleKey} onChange={handleExampleChange} />
      {renderSample(exampleKey)}
    </>
  );
}

export const Example = memo<ExampleProps>(ExampleComponent);
