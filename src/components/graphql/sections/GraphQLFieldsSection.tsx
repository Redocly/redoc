import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import { graphqlTypeDataAtom, graphqlTypeLookupAtom } from '../../../jotai/graphql.js';
import { GraphQLFieldView } from '../GraphQLFieldView.js';
import {
  useCollapsibleEntryKey,
  useExpandableSection,
  useRegisterCollapsibleEntry,
} from '../../../hooks/useExpandableSection.js';
import { graphqlTypeHasExpandableFields } from '../../../utils/graphql-type-expansion.js';
import { globalOptionsAtom } from '../../../jotai/store.js';

export function GraphQLFieldsSection({ node }: { node: ItemContentNode }): ReactElement {
  const { fieldExpandLevel: maxExpandDepth } = useAtomValue(globalOptionsAtom);
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const typeName = node.graphqlTypeName;
  const typeData = useAtomValue(graphqlTypeDataAtom(typeName ?? ''));

  const fields = typeData?.fields ?? [];

  const isExpandable = graphqlTypeHasExpandableFields(typeData, 0, maxExpandDepth, lookup);
  const isExpanded = useExpandableSection(node.variant, isExpandable);
  useRegisterCollapsibleEntry(
    useCollapsibleEntryKey(isExpandable ? node.variant : undefined),
    Boolean(isExpanded),
  );

  if (fields.length === 0) return <></>;

  return (
    <>
      {fields.map((field) => (
        <GraphQLFieldView
          key={field.name}
          field={field}
          fieldExpandLevel={0}
          parentTypeName={typeName}
          parentRequiresScopes={typeData?.requiresScopes ?? null}
          expanded={isExpanded}
        />
      ))}
    </>
  );
}
