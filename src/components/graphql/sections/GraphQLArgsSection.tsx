import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import {
  graphqlDirectiveDataAtom,
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeLookupAtom,
} from '../../../jotai/graphql.js';
import { GraphQLFieldView } from '../GraphQLFieldView.js';
import {
  useCollapsibleEntryKey,
  useExpandableSection,
  useRegisterCollapsibleEntry,
} from '../../../hooks/useExpandableSection.js';
import { isGraphqlFieldExpandable } from '../../../utils/graphql-type-expansion.js';
import { globalOptionsAtom } from '../../../jotai/store.js';

export function GraphQLArgsSection({ node }: { node: ItemContentNode }): ReactElement {
  const { fieldExpandLevel: maxExpandDepth } = useAtomValue(globalOptionsAtom);
  const lookup = useAtomValue(graphqlTypeLookupAtom);

  const operationField = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(node.graphqlOperationType, node.graphqlFieldName)),
  );

  const isDirectiveNode =
    !!node.graphqlTypeName && node.graphqlOperationType == null && node.graphqlFieldName == null;
  const directiveDefinition = useAtomValue(
    graphqlDirectiveDataAtom(isDirectiveNode ? (node.graphqlTypeName ?? '') : ''),
  );

  const operationArgs = operationField?.args ?? null;
  const directiveArgs = directiveDefinition?.args ?? null;
  const renderedArgs = (operationArgs?.length ? operationArgs : directiveArgs) ?? null;

  const isExpandable =
    !!renderedArgs &&
    renderedArgs.some((arg) => isGraphqlFieldExpandable(arg, 0, maxExpandDepth, lookup));
  const isExpanded = useExpandableSection(node.variant, isExpandable);
  useRegisterCollapsibleEntry(
    useCollapsibleEntryKey(isExpandable ? node.variant : undefined),
    Boolean(isExpanded),
  );

  if (operationArgs && operationArgs.length > 0) {
    return (
      <>
        {operationArgs.map((arg) => (
          <GraphQLFieldView
            key={arg.name}
            field={arg}
            isArgument
            fieldExpandLevel={0}
            parentTypeName={node.graphqlFieldName}
            parentRequiresScopes={
              operationField ? (operationField.requiresScopes ?? null) : undefined
            }
            expanded={isExpanded}
          />
        ))}
      </>
    );
  }

  if (directiveArgs && directiveArgs.length > 0) {
    const parentName = `@${directiveDefinition?.name}`;
    return (
      <>
        {directiveArgs.map((arg) => (
          <GraphQLFieldView
            key={arg.name}
            field={arg}
            isArgument
            fieldExpandLevel={0}
            parentTypeName={parentName}
            expanded={isExpanded}
          />
        ))}
      </>
    );
  }

  return <></>;
}
