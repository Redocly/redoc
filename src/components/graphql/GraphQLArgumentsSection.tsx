import { memo } from 'react';

import type { GraphqlStoreFieldData } from '../../types/graphql-store.js';

import { GraphQLFieldView } from './GraphQLFieldView.js';

interface Props {
  args: ReadonlyArray<GraphqlStoreFieldData>;
  fieldExpandLevel?: number;
  parentName?: string;
  title?: string;
  sectionKey?: string;
}

function GraphQLArgumentsSectionComponent({
  args,
  fieldExpandLevel = 0,
  parentName,
  title,
  sectionKey,
}: Props) {
  return (
    <>
      {title && (
        <h4
          style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)' as any,
            margin: '0 0 var(--spacing-xxs, 4px)',
          }}
        >
          {title}
        </h4>
      )}
      {args.map((arg) => (
        <GraphQLFieldView
          key={arg.name}
          field={arg}
          isArgument
          fieldExpandLevel={fieldExpandLevel}
          parentTypeName={parentName}
          sectionKey={sectionKey}
        />
      ))}
    </>
  );
}

export const GraphQLArgumentsSection = memo<Props>(GraphQLArgumentsSectionComponent);
