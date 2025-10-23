import { useState, useEffect } from 'react';

import type { ReactElement } from 'react';
import type { ExampleModel } from '../../models/index.js';
import type { SelectOption } from '../common/index.js';

import { MimeLabel, Container, Select } from '../common/index.js';
import { SelectOrLabel } from '../SelectOrLabel/index.js';
import { normalizeText } from '../../utils/index.js';
import { useTelemetry } from '../../hooks/index.js';

export interface ExampleModelsMap {
  [key: string]: ExampleModel;
}

interface IndexedOption extends SelectOption {
  idx: number;
}

export interface ExampleSwitchOptions {
  exampleKey?: string;
}

export interface ExampleSwitchProps extends ExampleSwitchOptions {
  examples: ExampleModelsMap;
  onChange: (key: string) => void;
  className?: string;
}

export const ExampleSwitch = ({
  exampleKey,
  examples,
  onChange,
  className,
}: ExampleSwitchProps): ReactElement | null => {
  const telemetry = useTelemetry();
  const examplesKeys = Object.keys(examples);
  const defaultIdx = exampleKey ? examplesKeys.indexOf(exampleKey) : 0;

  const [activeIdx, setActiveIdx] = useState(defaultIdx > -1 ? defaultIdx : 0);

  useEffect(() => setActiveIdx(defaultIdx > -1 ? defaultIdx : 0), [exampleKey, defaultIdx]);

  const options: IndexedOption[] = examplesKeys.map((name, idx) => ({
    value: normalizeText(examples[name].summary) || name,
    idx,
  }));

  const handleChange = ({ idx }: IndexedOption) => {
    telemetry.sendExamplesSwitcherClickedMessage({
      exampleNumber: idx,
      totalExamples: examplesKeys.length,
    });
    setActiveIdx(idx);
    onChange(examplesKeys[idx]);
  };

  if (options.length < 2) {
    return null;
  }

  return (
    <Container data-testid="example-switch" className={className}>
      <SelectOrLabel
        Select={Select}
        Label={MimeLabel}
        variant="dark"
        fullWidth
        options={options}
        value={options[activeIdx]?.value}
        onChange={handleChange}
      />
    </Container>
  );
};
