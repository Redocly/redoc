import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { GraphQLResponsePanelItem } from '../../../types/content.js';

import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { CodeBlockPanel, StyledJsonViewer } from '../styled.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import {
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeLookupAtom,
} from '../../../jotai/graphql.js';
import { generateOperationResponseExample } from '../../../utils/graphql-samples.js';
import { ResponsePanelHeader } from './styled.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

export function GraphQLResponseItem({ node }: { node: GraphQLResponsePanelItem }): ReactElement {
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const opData = node.graphqlOperationData;

  const operation = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(opData?.operationType, opData?.operationName)),
  );

  const responseData = useMemo(() => {
    if (!operation) return null;
    return generateOperationResponseExample(operation.type.display, lookup, jsonSamplesDepth);
  }, [operation, lookup, jsonSamplesDepth]);

  if (!responseData) return <></>;

  return (
    <CodeBlockPanel
      className="panel-response-samples"
      header={() => (
        <ResponsePanelHeader>
          <PanelHeaderTitle>{translate('responseSample', 'Response sample')}</PanelHeaderTitle>
        </ResponsePanelHeader>
      )}
      isExpandable={false}
    >
      <StyledJsonViewer data={responseData} expandLevel={Number.POSITIVE_INFINITY} />
    </CodeBlockPanel>
  );
}
