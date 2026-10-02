import { memo } from 'react';

import type { GraphqlStoreFieldData } from '../../types/graphql-store.js';

import { GraphQLFieldView } from './GraphQLFieldView.js';

interface Props {
  args: ReadonlyArray<GraphqlStoreFieldData>;
  fieldExpandLevel?: number;
  parentName?: string;
  title?: string;
  expanded?: boolean;
}

function GraphQLArgumentsSectionComponent({
  args,
  fieldExpandLevel = 0,
  parentName,
  title,
  expanded,
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
          expanded={expanded}
        />
      ))}
    </>
  );
}

export const GraphQLArgumentsSection = memo<Props>(GraphQLArgumentsSectionComponent);
