import { memo, useCallback } from 'react';

import type { ReactElement } from 'react';
import type { OperationModel } from '../../models/index.js';
import type { Unstable_ExternalCodeSample } from '../../services/index.js';
import type { ExampleSwitchOptions } from '../Samples/index.js';

import { CodeBlock } from '@redocly/theme/components/CodeBlock/CodeBlock';

import { SelectOrLabel } from '../SelectOrLabel/index.js';
import { MediaTypesSwitch } from '../MediaTypeSwitch/index.js';
import { SelectWrapper } from '../PayloadSamples/index.js';
import { Example } from './Example.js';
import { MimeLabel, Select } from '../common/index.js';
import { styled } from '../../styled-components.js';

interface CodeSamplesProps extends ExampleSwitchOptions {
  operation: OperationModel;
  lang: string;
  source?: string;
  externalSample?: Unstable_ExternalCodeSample;
  pathParams?: any;
  properties?: any;
  onlyDefaultSample?: boolean;
  onlyDefaultMimeType?: boolean;
  onCopyClick(): void;
}

function CodeSampleComponent({ onCopyClick, ...props }: CodeSamplesProps): ReactElement {
  const mimeContent = props.operation.requestBody?.content;
  const renderSelect = useCallback(
    (props) => {
      const hasSelect = (mimeContent?.mediaTypes?.length ?? 0) > 1;
      return hasSelect ? (
        <SelectWrapper>
          <SelectOrLabel Label={MimeLabel} Select={Select} variant="dark" fullWidth {...props} />
        </SelectWrapper>
      ) : null;
    },
    [mimeContent],
  );

  const renderSample = useCallback(
    (exampleName?: string) => {
      return props.source ? (
        <StyledCodeBlock
          lang={props.lang}
          source={props.source}
          header={{
            className: 'code-block-header',
            controls: {
              copy: {
                onClick: onCopyClick,
              },
            },
          }}
        />
      ) : (
        <StyledCodeBlock
          lang={props.lang}
          externalSource={{
            sample: props.externalSample as Unstable_ExternalCodeSample,
            exampleName,
            operation: props.operation,
            pathParams: props.pathParams,
            properties: props.properties,
          }}
          header={{
            className: 'code-block-header',
            controls: {
              copy: {
                onClick: onCopyClick,
              },
            },
          }}
        />
      );
    },
    [
      onCopyClick,
      props.externalSample,
      props.lang,
      props.operation,
      props.pathParams,
      props.properties,
      props.source,
    ],
  );

  if (mimeContent === undefined || props.source != undefined) {
    return renderSample();
  }

  return (
    <MediaTypesSwitch content={mimeContent} renderSelect={renderSelect}>
      {(mediaType) => (
        <Example mediaType={mediaType} mediaContent={mimeContent} renderSample={renderSample} />
      )}
    </MediaTypesSwitch>
  );
}

export const CodeSample = memo<CodeSamplesProps>(CodeSampleComponent);

const StyledCodeBlock = styled(CodeBlock)`
  border: none;
  margin: 0;

  .code-block-header {
    border-bottom: 0;
    padding-right: var(--spacing-sm);
  }
`;
