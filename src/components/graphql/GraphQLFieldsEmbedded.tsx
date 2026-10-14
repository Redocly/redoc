import { memo } from 'react';
import { useAtomValue } from 'jotai';

import { graphqlTypeDataAtom } from '../../jotai/graphql.js';
import { GraphQLFieldView } from './GraphQLFieldView.js';

interface Props {
  name: string;
  contrast?: boolean;
  fieldExpandLevel: number;
  expanded?: boolean;
  parentPath?: string;
}

function GraphQLFieldsEmbeddedComponent({
  name,
  contrast,
  fieldExpandLevel,
  expanded,
  parentPath,
}: Props) {
  const typeData = useAtomValue(graphqlTypeDataAtom(name));
  const fields = typeData?.fields ?? [];

  if (fields.length === 0) return null;

  return (
    <>
      {fields.map((field) => (
        <GraphQLFieldView
          key={field.name}
          field={field}
          contrast={contrast}
          fieldExpandLevel={fieldExpandLevel}
          parentTypeName={parentPath ?? name}
          parentRequiresScopes={typeData?.requiresScopes ?? null}
          expanded={expanded}
        />
      ))}
    </>
  );
}

export const GraphQLFieldsEmbedded = memo<Props>(GraphQLFieldsEmbeddedComponent);
