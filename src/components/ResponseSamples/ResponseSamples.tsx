import { memo, useCallback } from 'react';

import type { ReactElement } from 'react';
import type { OperationModel, ResponseModel } from '../../models/index.js';

import { PayloadSamples, StyledCodeBlock } from '../PayloadSamples/index.js';
import { Summary } from './Summary.js';
import { Tabs } from '../Tabs/index.js';
import { CodeBlockPanel } from '../common/index.js';
import { useTelemetry, useTranslate } from '../../hooks/index.js';

export interface ResponseSamplesProps {
  operation: OperationModel;
  activeResponseTab?: string;
  onTabChange: (tab: string) => void;
}

function ResponseSamplesComponent({
  operation,
  activeResponseTab,
  onTabChange,
}: ResponseSamplesProps): ReactElement | null {
  const translate = useTranslate();
  const telemetry = useTelemetry();
  const responses = operation.responses.filter(
    (response: ResponseModel): response is Required<ResponseModel> =>
      response.content?.hasSample ?? false,
  );

  const tabs = operation.responses.map(({ code }) => ({ key: code, title: code }));
  const activeTab = tabs?.find(({ key }) => key === activeResponseTab) || tabs?.[0];

  const handleCodeSampleCopy = useCallback(() => {
    telemetry.sendCopyCodeSnippetClickedMessage({ snippetType: 'response' });
  }, [telemetry]);

  if (!responses.length) {
    return null;
  }

  const renderSummary = () => {
    return (
      <Summary
        tabs={<Tabs tabs={tabs} activeTab={activeTab} onChange={(tab) => onTabChange(tab.key)} />}
      />
    );
  };

  return (
    <CodeBlockPanel className="panel-response-samples" header={renderSummary} isExpandable={false}>
      {operation.responses.map((response) =>
        response.code === activeTab.key ? (
          <div key={response.code}>
            {response?.content?.hasSample ? (
              <PayloadSamples content={response.content} onCopyClick={handleCodeSampleCopy} />
            ) : (
              <StyledCodeBlock source={translate('openapi.noResponseContent', 'No content')} />
            )}
          </div>
        ) : null,
      )}
    </CodeBlockPanel>
  );
}

export const ResponseSamples = memo(ResponseSamplesComponent);
