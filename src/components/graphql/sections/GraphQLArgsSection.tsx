import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { styled } from 'styled-components';
import { Admonition } from '@redocly/theme/components/Admonition/Admonition';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import {
  graphqlDirectiveDataAtom,
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeLookupAtom,
} from '../../../jotai/graphql.js';
import { GraphQLFieldView } from '../GraphQLFieldView.js';
import { renderDescription } from '../renderDescription.js';
import { Markdown } from '../../common/Markdown.js';
import { FieldNameBox, FieldName, PanelAnnotation, InlineCode } from '../styled.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import {
  useCollapsibleEntryKey,
  useExpandableSection,
  useRegisterCollapsibleEntry,
} from '../../../hooks/useExpandableSection.js';
import { isGraphqlFieldExpandable } from '../../../utils/graphql-type-expansion.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { useMarkdownAdapter } from '../../../contexts/markdownAdapter.js';

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

  const schemaArgs = node.graphqlSchema;
  if (!Array.isArray(schemaArgs) || schemaArgs.length === 0) return <></>;

  return (
    <>
      {(schemaArgs as FallbackArg[]).map((arg) => (
        <FallbackArgRow key={arg.name} arg={arg} />
      ))}
    </>
  );
}

type FallbackArg = {
  name: string;
  type: string;
  description?: unknown;
  deprecationReason?: string;
  defaultValue?: unknown;
};

function FallbackArgRow({ arg }: { arg: FallbackArg }) {
  const translate = useSpecTranslate();
  const isDeprecated = !!arg.deprecationReason;
  const adapter = useMarkdownAdapter();
  const deprecationReasonAst = useMemo(
    () => (arg.deprecationReason ? (adapter.parse(arg.deprecationReason) ?? null) : null),
    [arg.deprecationReason, adapter],
  );

  return (
    <FallbackArgWrapper>
      <FieldNameBox>
        <FieldName $isDeprecated={isDeprecated}>{arg.name}</FieldName>
        <ArgType>{arg.type}</ArgType>
      </FieldNameBox>
      {arg.defaultValue !== undefined && (
        <PanelAnnotation>
          {translate('defaultValue', 'Default')}:{' '}
          <InlineCode>{JSON.stringify(arg.defaultValue)}</InlineCode>
        </PanelAnnotation>
      )}
      {arg.description != null && arg.description !== '' && (
        <PanelAnnotation>{renderDescription(arg.description)}</PanelAnnotation>
      )}
      {deprecationReasonAst && (
        <Admonition type="warning" name={translate('deprecationReason', 'Deprecation reason')}>
          <Markdown source={deprecationReasonAst} />
        </Admonition>
      )}
    </FallbackArgWrapper>
  );
}

const FallbackArgWrapper = styled.div`
  padding: var(--spacing-base) 0;
  border-bottom: 1px solid var(--border-color-primary);
`;

const ArgType = styled.span`
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
`;
