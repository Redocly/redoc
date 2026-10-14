import { useAtomValue } from 'jotai';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import {
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeDataAtom,
  graphqlTypeLookupAtom,
} from '../../../jotai/graphql.js';
import { GraphQLReturnTypeDetails } from '../GraphQLReturnTypeDetails.js';
import { GraphQLTypeViewByName } from '../GraphQLTypeView.js';
import { ArrowIcon } from '../ArrowIcon.js';
import {
  useCollapsibleEntryKey,
  useExpandableSection,
  useRegisterCollapsibleEntry,
} from '../../../hooks/useExpandableSection.js';
import { graphqlTypeHasExpandableFields } from '../../../utils/graphql-type-expansion.js';
import { globalOptionsAtom } from '../../../jotai/store.js';

export function ReturnTypeSection({ node }: { node: ItemContentNode }): ReactElement {
  const { fieldExpandLevel: maxExpandDepth } = useAtomValue(globalOptionsAtom);
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const typeName = node.graphqlTypeName;

  const operationField = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(node.graphqlOperationType, node.graphqlFieldName)),
  );

  const namedReturnType = useAtomValue(graphqlTypeDataAtom(typeName ?? ''));
  const isExpandable = graphqlTypeHasExpandableFields(namedReturnType, 0, maxExpandDepth, lookup);
  const isExpanded = useExpandableSection(node.variant, isExpandable);
  useRegisterCollapsibleEntry(
    useCollapsibleEntryKey(isExpandable ? node.variant : undefined),
    Boolean(isExpanded),
  );

  if (operationField) {
    return (
      <div>
        <ReturnTypeLinkRow>
          <ArrowIcon />
          <GraphQLReturnTypeDetails typeRef={operationField.type} />
        </ReturnTypeLinkRow>
        <GraphQLTypeViewByName
          typeName={typeName ?? ''}
          fieldExpandLevel={0}
          expanded={isExpanded}
        />
      </div>
    );
  }

  if (typeName) {
    return <GraphQLTypeViewByName typeName={typeName} fieldExpandLevel={0} expanded={isExpanded} />;
  }

  return <></>;
}

const ReturnTypeLinkRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-unit, 4px);
  margin-bottom: var(--spacing-xs, 8px);
  color: var(--link-color-primary, var(--text-color-secondary));
`;
