import { memo } from 'react';
import { useAtomValue } from 'jotai';

import { graphqlTypeDataAtom } from '../../jotai/graphql.js';
import { GraphQLFieldsEmbedded } from './GraphQLFieldsEmbedded.js';
import { GraphQLEnumEmbedded } from './GraphQLEnumEmbedded.js';
import { GraphQLUnionEmbedded } from './GraphQLUnionEmbedded.js';
import { PanelAnnotation } from './styled.js';
import { renderDescription } from './renderDescription.js';

interface NamedTypeRendererProps {
  typeName: string;
  contrast?: boolean;
  fieldExpandLevel?: number;
  expanded?: boolean;
  parentPath?: string;
}

function NamedTypeRendererComponent({
  typeName,
  contrast,
  fieldExpandLevel = 0,
  expanded,
  parentPath,
}: NamedTypeRendererProps) {
  const typeData = useAtomValue(graphqlTypeDataAtom(typeName));

  if (!typeData) return null;

  if (typeData.variant === 'enum') {
    return <GraphQLEnumEmbedded name={typeName} />;
  }

  if (typeData.variant === 'scalar') {
    return typeData.description ? (
      <PanelAnnotation>{renderDescription(typeData.description)}</PanelAnnotation>
    ) : null;
  }

  if (
    typeData.variant === 'object' ||
    typeData.variant === 'interface' ||
    typeData.variant === 'input'
  ) {
    return (
      <GraphQLFieldsEmbedded
        name={typeName}
        contrast={contrast}
        fieldExpandLevel={fieldExpandLevel}
        expanded={expanded}
        parentPath={parentPath}
      />
    );
  }

  if (typeData.variant === 'union') {
    return <GraphQLUnionEmbedded name={typeName} />;
  }

  return null;
}

const NamedTypeRenderer = memo<NamedTypeRendererProps>(NamedTypeRendererComponent);

export { NamedTypeRenderer as GraphQLTypeViewByName };
