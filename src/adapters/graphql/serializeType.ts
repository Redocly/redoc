import {
  getNamedType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isRequiredArgument,
  isRequiredInputField,
  isScalarType,
  isUnionType,
} from 'graphql';

import type {
  GraphQLArgument,
  GraphQLDirective,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLInputField,
  GraphQLNamedType,
  GraphQLType,
} from 'graphql';
import type {
  GraphqlDescription,
  GraphqlDirectiveData,
  GraphqlEnumValueData,
  GraphqlStoreFieldData,
  GraphqlRequiresScopes,
  GraphqlTypeData,
  GraphqlTypeRef,
} from '../../types/graphql-store.js';
import type { DirectiveTarget } from '../../utils/graphql-directive-utils.js';
import type { ParseMarkdownOptions } from '../utils/parseMarkdown.js';

import { getRequiresScopesDirective } from '../../utils/graphql-directive-utils.js';
import { parseMarkdown } from '../utils/parseMarkdown.js';

type DescriptionSerializer = (
  description: string | null | undefined,
) => GraphqlDescription | undefined;

/** Without markdown options a description stays the raw string. */
function createDescriptionSerializer(
  markdownOptions?: ParseMarkdownOptions,
): DescriptionSerializer {
  return (description) =>
    markdownOptions?.markdownParser
      ? parseMarkdown(description, markdownOptions)
      : (description ?? undefined);
}

function toTypeRef(type: GraphQLType): GraphqlTypeRef {
  const namedType = getNamedType(type);
  const isReturnNonNull = isNonNullType(type);
  const possibleListType = isReturnNonNull ? type.ofType : type;
  const isList = isListType(possibleListType);
  const isNonNull = isList ? isNonNullType(possibleListType.ofType) : isReturnNonNull;

  return {
    display: String(type),
    name: namedType.name,
    isList,
    isNonNull,
    isListNonNull: isList && isReturnNonNull,
  };
}

function serializeRequiresScopes(target: DirectiveTarget): GraphqlRequiresScopes | undefined {
  const directive = getRequiresScopesDirective(target);
  return directive ? { scopes: directive.scopes } : undefined;
}

export type GraphqlTypeSerializer = {
  serializeNamedType(type: GraphQLNamedType): GraphqlTypeData;
  serializeDirective(directive: GraphQLDirective): GraphqlDirectiveData;
};

export function createGraphqlTypeSerializer(
  markdownOptions?: ParseMarkdownOptions,
): GraphqlTypeSerializer {
  const describe = createDescriptionSerializer(markdownOptions);

  const serializeArgument = (arg: GraphQLArgument): GraphqlStoreFieldData => ({
    name: arg.name,
    type: toTypeRef(arg.type),
    description: describe(arg.description),
    deprecationReason: arg.deprecationReason ?? undefined,
    defaultValue: arg.defaultValue,
    required: isRequiredArgument(arg) || undefined,
    requiresScopes: serializeRequiresScopes(arg),
  });

  const serializeOutputField = (field: GraphQLField<unknown, unknown>): GraphqlStoreFieldData => ({
    name: field.name,
    type: toTypeRef(field.type),
    description: describe(field.description),
    deprecationReason: field.deprecationReason ?? undefined,
    args: field.args.length > 0 ? field.args.map(serializeArgument) : undefined,
    requiresScopes: serializeRequiresScopes(field),
  });

  const serializeInputField = (field: GraphQLInputField): GraphqlStoreFieldData => ({
    name: field.name,
    type: toTypeRef(field.type),
    description: describe(field.description),
    deprecationReason: field.deprecationReason ?? undefined,
    defaultValue: field.defaultValue,
    required: isRequiredInputField(field) || undefined,
    requiresScopes: serializeRequiresScopes(field),
  });

  const serializeEnumValue = (value: GraphQLEnumValue): GraphqlEnumValueData => ({
    name: value.name,
    description: describe(value.description),
    deprecationReason: value.deprecationReason ?? undefined,
    requiresScopes: serializeRequiresScopes(value),
  });

  const serializeNamedType = (type: GraphQLNamedType): GraphqlTypeData => {
    const base = {
      name: type.name,
      description: describe(type.description),
      requiresScopes: serializeRequiresScopes(type),
    };

    if (isObjectType(type) || isInterfaceType(type)) {
      const interfaces = type.getInterfaces().map((i) => i.name);
      return {
        ...base,
        variant: isObjectType(type) ? 'object' : 'interface',
        fields: Object.values(type.getFields()).map(serializeOutputField),
        interfaces: interfaces.length > 0 ? interfaces : undefined,
      };
    }

    if (isInputObjectType(type)) {
      return {
        ...base,
        variant: 'input',
        fields: Object.values(type.getFields()).map(serializeInputField),
        isOneOf: type.isOneOf || undefined,
      };
    }

    if (isUnionType(type)) {
      return {
        ...base,
        variant: 'union',
        possibleTypes: type.getTypes().map((member) => member.name),
      };
    }

    if (isEnumType(type)) {
      return {
        ...base,
        variant: 'enum',
        enumValues: type.getValues().map(serializeEnumValue),
      };
    }

    if (isScalarType(type)) {
      return {
        ...base,
        variant: 'scalar',
        specifiedByUrl: type.specifiedByURL ?? undefined,
      };
    }

    return { ...base, variant: 'scalar' };
  };

  const serializeDirective = (directive: GraphQLDirective): GraphqlDirectiveData => ({
    name: directive.name,
    description: describe(directive.description),
    locations: [...directive.locations],
    args: directive.args.length > 0 ? directive.args.map(serializeArgument) : undefined,
    isRepeatable: directive.isRepeatable || undefined,
  });

  return { serializeNamedType, serializeDirective };
}
