import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { GraphQLQueryPanelItem } from '../../../types/content.js';

import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { CodeBlockPanel, StyledCodeBlock, StyledJsonViewer } from '../styled.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import {
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeLookupAtom,
} from '../../../jotai/graphql.js';
import {
  generateOperationExample,
  generateOperationVariablesExample,
} from '../../../utils/graphql-samples.js';
import { ResponsePanelHeader, VariablesContainer, VariablesTitle } from './styled.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { useCopyCodeTelemetry } from '../../../hooks/useCopyCodeTelemetry.js';

const OPERATION_LABEL_KEYS: Record<string, string> = {
  query: 'querySample',
  mutation: 'mutationSample',
  subscription: 'subscriptionSample',
};

export function GraphQLQueryItem({ node }: { node: GraphQLQueryPanelItem }): ReactElement {
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const { jsonSamplesDepth, samplesMaxInlineArgs } = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const opData = node.graphqlOperationData;
  const onCopy = useCopyCodeTelemetry('request');

  const operation = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(opData?.operationType, opData?.operationName)),
  );

  const { queryString, variablesData, hasVariables } = useMemo(() => {
    if (!opData) {
      return {
        queryString: '# No schema available',
        variablesData: {},
        hasVariables: false,
      };
    }
    if (!operation) {
      return {
        queryString: `# Operation "${opData.operationName}" not found`,
        variablesData: {},
        hasVariables: false,
      };
    }
    const args = operation.args ?? [];
    const multilineArguments = args.length > samplesMaxInlineArgs;
    const qs = generateOperationExample(
      opData.operationType,
      operation,
      lookup,
      jsonSamplesDepth,
      multilineArguments,
      {
        argumentsHere: translate('arguments.here', 'Arguments Here'),
        fragment: translate('content.fragment', 'Fragment'),
      },
    );
    const vars = generateOperationVariablesExample(args, lookup, jsonSamplesDepth);
    return {
      queryString: qs,
      variablesData: vars,
      hasVariables: args.length > 0,
    };
  }, [operation, opData, lookup, jsonSamplesDepth, samplesMaxInlineArgs, translate]);

  const headerKey = opData
    ? (OPERATION_LABEL_KEYS[opData.operationType] ?? 'querySample')
    : 'querySample';
  const headerLabel = translate(headerKey, 'Query sample');

  return (
    <CodeBlockPanel
      className="panel-response-samples"
      header={() => (
        <ResponsePanelHeader>
          <PanelHeaderTitle>{headerLabel}</PanelHeaderTitle>
        </ResponsePanelHeader>
      )}
      isExpandable={false}
    >
      <StyledCodeBlock
        lang="graphql"
        source={queryString}
        header={{
          className: 'code-block-header',
          controls: { copy: { onClick: onCopy('graphql') } },
        }}
      />
      {hasVariables && (
        <VariablesContainer>
          <StyledJsonViewer
            data={variablesData}
            expandLevel={Number.POSITIVE_INFINITY}
            title={<VariablesTitle>{translate('variables', 'Variables')}</VariablesTitle>}
          />
        </VariablesContainer>
      )}
    </CodeBlockPanel>
  );
}
