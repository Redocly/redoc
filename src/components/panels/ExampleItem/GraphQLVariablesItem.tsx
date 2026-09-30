import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { GraphQLVariablesPanelItem } from '../../../types/content.js';

import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { CodeBlockPanel, StyledJsonViewer } from '../styled.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import {
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeLookupAtom,
} from '../../../jotai/graphql.js';
import { generateOperationVariablesExample } from '../../../utils/graphql-samples.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { ResponsePanelHeader } from './styled.js';

export function GraphQLVariablesItem({ node }: { node: GraphQLVariablesPanelItem }): ReactElement {
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const opData = node.graphqlOperationData;

  const operation = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(opData?.operationType, opData?.operationName)),
  );

  const variablesData = useMemo(() => {
    const args = operation?.args ?? [];
    if (args.length === 0) return null;
    return generateOperationVariablesExample(args, lookup, jsonSamplesDepth);
  }, [operation, lookup, jsonSamplesDepth]);

  if (!variablesData) return <></>;

  return (
    <CodeBlockPanel
      className="panel-response-samples"
      header={() => (
        <ResponsePanelHeader>
          <PanelHeaderTitle>{translate('variables', 'Variables')}</PanelHeaderTitle>
        </ResponsePanelHeader>
      )}
      isExpandable={false}
    >
      <StyledJsonViewer data={variablesData} expandLevel={Number.POSITIVE_INFINITY} />
    </CodeBlockPanel>
  );
}
