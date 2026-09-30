export type GraphqlOperationType = 'query' | 'mutation' | 'subscription';

export type GraphqlItemScope =
  | { kind: 'graphql-operation'; operationType: GraphqlOperationType; name: string }
  | { kind: 'graphql-type'; name: string }
  | { kind: 'graphql-directive'; name: string };

export type SpecSliceScope =
  | { kind: 'document' }
  | { kind: 'tag'; tagName: string }
  | {
      kind: 'operation';
      pathName: string;
      httpVerb: string;
      source: 'paths' | 'webhooks';
    }
  | { kind: 'schema'; name: string }
  | { kind: 'channel'; channelId: string }
  | { kind: 'async-operation'; operationId: string }
  | GraphqlItemScope
  | { kind: 'graphql-group'; label?: string; members: GraphqlItemScope[] };

export type SliceContentKind = 'yaml' | 'graphql';
