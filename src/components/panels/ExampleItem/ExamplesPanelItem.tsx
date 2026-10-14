import type { ReactElement } from 'react';
import type { ExamplesNode, PayloadExamplesPanelItem } from '../../../types/content.js';
import type { PanelNodeProps } from '../PanelNodeProps.js';
import type { ExampleKind, KindRenderer } from './types.js';

import { CallbackPayloadItem } from './CallbackPayloadItem.js';
import { CodeSampleItem } from './CodeSampleItem.js';
import { GraphQLQueryItem } from './GraphQLQueryItem.js';
import { GraphQLResponseItem } from './GraphQLResponseItem.js';
import { GraphQLTypeSampleItem } from './GraphQLTypeSampleItem.js';
import { GraphQLVariablesItem } from './GraphQLVariablesItem.js';
import { PayloadExampleItem } from './PayloadExampleItem.js';
import { ResponseExampleItem } from './ResponseExampleItem.js';

const EXAMPLE_KIND_MAPPER: Partial<Record<ExampleKind, KindRenderer>> = {
  'code-sample': CodeSampleItem as KindRenderer,
  'callback-payload': CallbackPayloadItem as KindRenderer,
  response: ResponseExampleItem as KindRenderer,
  payload: PayloadExampleItem as KindRenderer,
  'graphql-query': GraphQLQueryItem as KindRenderer,
  'graphql-response': GraphQLResponseItem as KindRenderer,
  'graphql-type-sample': GraphQLTypeSampleItem as KindRenderer,
  'graphql-variables': GraphQLVariablesItem as KindRenderer,
};

export function ExamplesPanelItem({ node }: PanelNodeProps): ReactElement {
  const panel = node as ExamplesNode;

  return (
    <>
      {panel.children.map((item, index) => {
        const ItemComponent = EXAMPLE_KIND_MAPPER[item.kind as ExampleKind];
        if (!ItemComponent) {
          return <PayloadExampleItem key={index} node={item as PayloadExamplesPanelItem} />;
        }
        return <ItemComponent key={index} node={item} />;
      })}
    </>
  );
}
