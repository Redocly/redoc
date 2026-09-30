import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { GraphQLTypeSamplePanelItem } from '../../../types/content.js';

import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { CodeBlockPanel, StyledJsonViewer } from '../styled.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { graphqlTypeLookupAtom } from '../../../jotai/graphql.js';
import { getTypeExample } from '../../../utils/graphql-samples.js';
import { ResponsePanelHeader } from './styled.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

export function GraphQLTypeSampleItem({
  node,
}: {
  node: GraphQLTypeSamplePanelItem;
}): ReactElement {
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const opData = node.graphqlOperationData;

  const { sampleData, isInput } = useMemo(() => {
    if (!opData) return { sampleData: null, isInput: false };
    const typeData = lookup(opData.typeName);
    if (!typeData) return { sampleData: null, isInput: false };
    return {
      sampleData: getTypeExample(opData.typeName, lookup, jsonSamplesDepth),
      isInput: typeData.variant === 'input',
    };
  }, [lookup, opData, jsonSamplesDepth]);

  if (sampleData == null) return <></>;

  return (
    <CodeBlockPanel
      className="panel-response-samples"
      header={() => (
        <ResponsePanelHeader>
          <PanelHeaderTitle>
            {isInput
              ? translate('requestSample', 'Request sample')
              : translate('responseSample', 'Response sample')}
          </PanelHeaderTitle>
        </ResponsePanelHeader>
      )}
      isExpandable={false}
    >
      <StyledJsonViewer data={sampleData} expandLevel={Number.POSITIVE_INFINITY} />
    </CodeBlockPanel>
  );
}
