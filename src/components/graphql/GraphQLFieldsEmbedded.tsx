import { memo } from 'react';
import { useAtomValue } from 'jotai';

import { graphqlTypeDataAtom } from '../../jotai/graphql.js';
import { GraphQLFieldView } from './GraphQLFieldView.js';

interface Props {
  name: string;
  contrast?: boolean;
  fieldExpandLevel: number;
  sectionKey?: string;
  parentPath?: string;
}

function GraphQLFieldsEmbeddedComponent({
  name,
  contrast,
  fieldExpandLevel,
  sectionKey,
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
          sectionKey={sectionKey}
        />
      ))}
    </>
  );
}

export const GraphQLFieldsEmbedded = memo<Props>(GraphQLFieldsEmbeddedComponent);
