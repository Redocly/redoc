import { useState, useEffect, memo, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { GraphqlRequiresScopes, GraphqlStoreFieldData } from '../../types/graphql-store.js';

import { Admonition } from '@redocly/theme/components/Admonition/Admonition';

import {
  FieldWrapper,
  FieldNameBox,
  FieldName,
  ExpandableFieldBody,
  PanelAnnotation,
  InlineCode,
} from './styled.js';
import { ViewNested } from './ViewNested.js';
import { LazyMount } from '../common/LazyMount.js';
import { GraphQLTypeViewByName } from './GraphQLTypeView.js';
import { GraphQLReturnTypeDetails } from './GraphQLReturnTypeDetails.js';
import { GraphQLArgumentsSection } from './GraphQLArgumentsSection.js';
import { RequiresScopesButton } from './RequiresScopesButton.js';
import { renderDescription } from './renderDescription.js';
import { Markdown } from '../common/Markdown.js';
import { DeepLinkAnchor } from '../common/DeepLinkAnchor.js';
import {
  buildGraphqlSuffix,
  getDeepLinkId,
  isGraphqlDeepLinkAncestor,
} from '../../utils/deep-link.js';
import { useDeepLinkUrl } from '../../hooks/useDeepLinkSection.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { useSchemaFieldTelemetry } from '../../telemetry/index.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { graphqlTypeLookupAtom } from '../../jotai/graphql.js';
import { mergeRequiresScopes } from '../../utils/graphql-scopes.js';
import {
  countNamedTypeFields,
  isGraphqlFieldExpandable,
} from '../../utils/graphql-type-expansion.js';
import { isWithinExpansionLevel } from '../../utils/expansion.js';
import { useMarkdownAdapter } from '../../contexts/markdownAdapter.js';
import { useUrlHash } from '../../hooks/useUrlHash.js';

const ESTIMATED_FIELD_ROW_HEIGHT = 72;

interface GraphQLFieldViewProps {
  field: GraphqlStoreFieldData;
  contrast?: boolean;
  isArgument?: boolean;
  fieldExpandLevel: number;
  parentTypeName?: string;
  parentRequiresScopes?: GraphqlRequiresScopes | null;
  expanded?: boolean;
}

function GraphQLFieldViewComponent({
  field,
  contrast,
  isArgument,
  fieldExpandLevel: treeDepth,
  parentTypeName,
  parentRequiresScopes,
  expanded,
}: GraphQLFieldViewProps): ReactElement {
  const { fieldExpandLevel: maxExpandDepth, schemasExpansionLevel } =
    useAtomValue(globalOptionsAtom);
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const adapter = useMarkdownAdapter();
  const translate = useSpecTranslate();
  const reportToggle = useSchemaFieldTelemetry();

  const childTreeDepth = treeDepth + 1;
  const graphqlPath = parentTypeName ? `${parentTypeName}.${field.name}` : field.name;

  const hash = useUrlHash();
  const lastHashRef = useRef(hash);
  if (hash) lastHashRef.current = hash;
  const isDeepLinkTarget = isGraphqlDeepLinkAncestor(lastHashRef.current, graphqlPath);

  const expandByDefault = isWithinExpansionLevel(treeDepth, schemasExpansionLevel, 0);

  const [userToggleTypes, setUserToggleTypes] = useState<boolean | undefined>(undefined);
  const [userToggleArguments, setUserToggleArguments] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setUserToggleTypes(undefined);
    setUserToggleArguments(undefined);
  }, [expanded]);

  const expandedTypes = userToggleTypes ?? expanded ?? (isDeepLinkTarget || expandByDefault);
  const expandedArguments =
    userToggleArguments ?? expanded ?? (isDeepLinkTarget || expandByDefault);

  const isDeprecated = !!field.deprecationReason;
  const deprecationReasonAst = useMemo(
    () => (field.deprecationReason ? (adapter.parse(field.deprecationReason) ?? null) : null),
    [field.deprecationReason, adapter],
  );
  const isRequired = !!isArgument && !!field.required;
  const args = field.args ?? [];
  const hasArgs = args.length > 0;
  const returnTypeFieldCount = countNamedTypeFields(field.type.name, lookup);
  const typeEstimatedHeight = returnTypeFieldCount * ESTIMATED_FIELD_ROW_HEIGHT;
  const argsEstimatedHeight = args.length * ESTIMATED_FIELD_ROW_HEIGHT;
  const toggleArguments = (): void => {
    const next = !expandedArguments;
    reportToggle({ depth: treeDepth, expanded: next, childCount: args.length, kind: 'arguments' });
    setUserToggleArguments(next);
  };
  const toggleReturnType = (): void => {
    const next = !expandedTypes;
    reportToggle({
      depth: treeDepth,
      expanded: next,
      childCount: returnTypeFieldCount,
      kind: 'returnType',
    });
    setUserToggleTypes(next);
  };
  const expandable = isGraphqlFieldExpandable(field, treeDepth, maxExpandDepth, lookup);
  const showBorder = !expandable || !expandedTypes;
  const fieldId = isArgument
    ? parentTypeName
      ? `arg-${parentTypeName}-${field.name}`
      : `arg-${field.name}`
    : parentTypeName
      ? `${parentTypeName}-${field.name}`
      : field.name;
  const collapsedArgs = args.map((arg) => ({ name: arg.name, required: !!arg.required }));

  const requiresScopesDirective = useMemo(
    () =>
      parentRequiresScopes !== undefined
        ? mergeRequiresScopes(field.requiresScopes, parentRequiresScopes)
        : null,
    [field.requiresScopes, parentRequiresScopes],
  );

  const graphqlSuffix = useMemo(
    () =>
      buildGraphqlSuffix({
        t: isArgument ? 'argument' : 'field',
        path: graphqlPath,
        arg: isArgument ? field.name : undefined,
      }),
    [graphqlPath, isArgument, field.name],
  );

  const deepLinkUrl = useDeepLinkUrl(graphqlSuffix);

  return (
    <div id={getDeepLinkId(deepLinkUrl) ?? fieldId}>
      <FieldWrapper $showBorder={showBorder}>
        <FieldNameBox>
          {deepLinkUrl && (
            <DeepLinkAnchor to={deepLinkUrl} label={`link to ${field.name}`} variant="field" />
          )}
          <FieldName $isDeprecated={isDeprecated}>{field.name}</FieldName>
          <GraphQLReturnTypeDetails
            typeRef={field.type}
            inline={!hasArgs}
            deprecated={isDeprecated}
            required={isRequired}
          />
        </FieldNameBox>

        {field.defaultValue !== undefined && (
          <PanelAnnotation>
            {translate('defaultValue', 'Default')}:{' '}
            <InlineCode>{JSON.stringify(field.defaultValue)}</InlineCode>
          </PanelAnnotation>
        )}

        {field.description && (
          <PanelAnnotation>{renderDescription(field.description)}</PanelAnnotation>
        )}

        {deprecationReasonAst && (
          <Admonition type="warning" name={translate('deprecationReason', 'Deprecation reason')}>
            <Markdown source={deprecationReasonAst} />
          </Admonition>
        )}

        {expandable && (
          <ExpandableFieldBody $contrast={!contrast}>
            {hasArgs && (
              <ViewNested
                expanded={expandedArguments}
                level={treeDepth}
                expandText={translate('arguments.show', 'Show arguments')}
                collapseText={translate('arguments.hide', 'Hide arguments')}
                collapsedArgs={collapsedArgs}
                onClick={toggleArguments}
              >
                <LazyMount
                  forceMount={isDeepLinkTarget || expandByDefault}
                  estimatedHeight={argsEstimatedHeight}
                >
                  <GraphQLArgumentsSection
                    args={args}
                    fieldExpandLevel={childTreeDepth}
                    parentName={graphqlPath}
                    expanded={expanded}
                  />
                </LazyMount>
              </ViewNested>
            )}
            <ViewNested
              expanded={expandedTypes}
              level={treeDepth}
              expandText={translate('returnTypes.show', 'Show return type')}
              collapseText={translate('returnTypes.hide', 'Hide return type')}
              onClick={toggleReturnType}
            >
              <LazyMount
                forceMount={isDeepLinkTarget || expandByDefault}
                estimatedHeight={typeEstimatedHeight}
              >
                <GraphQLTypeViewByName
                  typeName={field.type.name}
                  contrast={!contrast}
                  fieldExpandLevel={childTreeDepth}
                  expanded={expanded}
                  parentPath={graphqlPath}
                />
              </LazyMount>
            </ViewNested>
          </ExpandableFieldBody>
        )}
        <RequiresScopesButton directive={requiresScopesDirective} />
      </FieldWrapper>
    </div>
  );
}

export const GraphQLFieldView = memo<GraphQLFieldViewProps>(GraphQLFieldViewComponent);
