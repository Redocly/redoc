import type { GraphQLSchema } from 'graphql';
import type { MenuConfig, TypeGroupFilter } from '../../../types/graphql.js';

import { MENU_SLASH_DELIMITED_REGEX } from './menuSlashRegex.js';

export function validateGraphqlMenuConfig(schema: GraphQLSchema, menuConfig?: MenuConfig): void {
  menuConfig?.groups?.forEach((group) => {
    if (group.name.includes('/')) {
      throw new Error(`Group name ${group.name} is invalid. "/" is not allowed in group names.`);
    }

    validateNames(group.items, 'Item', (name) =>
      Boolean(
        schema.getQueryType()?.getFields()[name] ??
        schema.getMutationType()?.getFields()[name] ??
        schema.getSubscriptionType()?.getFields()[name] ??
        schema.getDirective(name) ??
        schema.getType(name),
      ),
    );
    validateNames(group.queries, 'Query', (n) => Boolean(schema.getQueryType()?.getFields()[n]));
    validateNames(group.mutations, 'Mutation', (n) =>
      Boolean(schema.getMutationType()?.getFields()[n]),
    );
    validateNames(group.subscriptions, 'Subscription', (n) =>
      Boolean(schema.getSubscriptionType()?.getFields()[n]),
    );
    validateNames(group.directives, 'Directive', (n) => Boolean(schema.getDirective(n)));
    validateNames(group.types, 'Type', (n) => Boolean(schema.getType(n)));
  });
}

function validateNames(
  filter: TypeGroupFilter | undefined,
  label: string,
  exists: (name: string) => boolean,
): void {
  if (!filter) return;

  const names = [...(filter.includeByName ?? []), ...(filter.excludeByName ?? [])];
  for (const name of names) {
    if (typeof name === 'string' && !MENU_SLASH_DELIMITED_REGEX.test(name) && !exists(name)) {
      throw new Error(`${label} ${name} does not exist in schema.`);
    }
  }
}
