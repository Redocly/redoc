import { memo, useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';

import type { ReactElement } from 'react';
import type { OpenAPIXCodeSample } from '../../types/index.js';
import type { Unstable_ExternalCodeSample } from '../../services/index.js';
import type { OperationModel } from '../../models/index.js';

import { PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';

import { PayloadSamples } from '../PayloadSamples/index.js';
import { CodeSample } from './CodeSample.js';
import { useCodeSamples } from './useCodeSamples.js';
import { isPayloadSample } from '../../models/index.js';
import { ServerListDropdown } from '../ServerListDropdown/index.js';
import { LanguageDropdown } from '../Language/index.js';
import { languageAtom } from '../../jotai/app.js';
import { CodeBlockPanel } from '../common/index.js';
import { useActiveWithFallback, useTelemetry } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

interface RequestSamplesProps {
  operation: OperationModel;
}

function RequestSamplesComponent({
  operation,
  ...props
}: RequestSamplesProps): ReactElement | null {
  const telemetry = useTelemetry();
  const [{ activeLanguage, languages }, setLanguage] = useAtom(languageAtom);
  const { samples } = useCodeSamples(operation);
  const isLanguagesAvailable = !!languages?.length;
  const localActiveLanguage = useActiveWithFallback(samples, activeLanguage);

  const onSelectLanguage = (selectedItem: string) => {
    setLanguage(selectedItem);
    telemetry.sendSelectLanguageClickedMessage({ language: selectedItem });
  };

  const renderSummary = () => {
    return (
      <StyledPanelHeader isExpandable={false}>
        <StyledServerListDropdown operation={operation} />
        {isLanguagesAvailable && (
          <LanguageDropdown
            activeTab={localActiveLanguage}
            samples={samples}
            onChange={onSelectLanguage}
          />
        )}
      </StyledPanelHeader>
    );
  };

  const handleCodeSampleCopy = useCallback(
    ({ lang }) =>
      () => {
        telemetry.sendCopyCodeSnippetClickedMessage({
          snippetType: 'request',
          language: lang,
        });
      },
    [telemetry],
  );

  const renderSamples = useMemo(
    () =>
      samples.map((sample) => {
        return sample.key === localActiveLanguage ? (
          <div key={sample.key + operation.id}>
            {isPayloadSample(sample) ? (
              <PayloadSamples
                content={sample.requestBodyContent}
                onCopyClick={handleCodeSampleCopy(sample)}
                {...props}
              />
            ) : (
              <CodeSample
                lang={sample.lang}
                source={(sample as OpenAPIXCodeSample).source}
                externalSample={sample as Unstable_ExternalCodeSample}
                operation={operation}
                onCopyClick={handleCodeSampleCopy(sample)}
                {...props}
              />
            )}
          </div>
        ) : null;
      }),
    [handleCodeSampleCopy, localActiveLanguage, operation, props, samples],
  );

  if (languages && !samples.length) {
    return (
      <CodeBlockPanel
        className="panel-request-samples"
        header={renderSummary}
        isExpandable={false}
        expanded={false}
      />
    );
  }

  return samples.length ? (
    <CodeBlockPanel className="panel-request-samples" header={renderSummary} isExpandable={false}>
      {renderSamples}
    </CodeBlockPanel>
  ) : null;
}

export const RequestSamples = memo<RequestSamplesProps>(RequestSamplesComponent);

const StyledPanelHeader = styled(PanelHeader)`
  flex-wrap: nowrap;
`;

const StyledServerListDropdown = styled(ServerListDropdown)<{ titleWidth?: number }>`
  padding-right: var(--spacing-base);
  min-width: 0;
`;
