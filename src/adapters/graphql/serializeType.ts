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
  GraphqlDirectiveData,
  GraphqlEnumValueData,
  GraphqlStoreFieldData,
  GraphqlRequiresScopes,
  GraphqlTypeData,
  GraphqlTypeRef,
} from '../../types/graphql-store.js';
import type { DirectiveTarget } from '../../utils/graphql-directive-utils.js';

import { getRequiresScopesDirective } from '../../utils/graphql-directive-utils.js';

export function toTypeRef(type: GraphQLType): GraphqlTypeRef {
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

function serializeArgument(arg: GraphQLArgument): GraphqlStoreFieldData {
  return {
    name: arg.name,
    type: toTypeRef(arg.type),
    description: arg.description ?? undefined,
    deprecationReason: arg.deprecationReason ?? undefined,
    defaultValue: arg.defaultValue,
    required: isRequiredArgument(arg) || undefined,
    requiresScopes: serializeRequiresScopes(arg),
  };
}

function serializeOutputField(field: GraphQLField<unknown, unknown>): GraphqlStoreFieldData {
  return {
    name: field.name,
    type: toTypeRef(field.type),
    description: field.description ?? undefined,
    deprecationReason: field.deprecationReason ?? undefined,
    args: field.args.length > 0 ? field.args.map(serializeArgument) : undefined,
    requiresScopes: serializeRequiresScopes(field),
  };
}

function serializeInputField(field: GraphQLInputField): GraphqlStoreFieldData {
  return {
    name: field.name,
    type: toTypeRef(field.type),
    description: field.description ?? undefined,
    deprecationReason: field.deprecationReason ?? undefined,
    defaultValue: field.defaultValue,
    required: isRequiredInputField(field) || undefined,
    requiresScopes: serializeRequiresScopes(field),
  };
}

function serializeEnumValue(value: GraphQLEnumValue): GraphqlEnumValueData {
  return {
    name: value.name,
    description: value.description ?? undefined,
    deprecationReason: value.deprecationReason ?? undefined,
    requiresScopes: serializeRequiresScopes(value),
  };
}

export function serializeNamedType(type: GraphQLNamedType): GraphqlTypeData {
  const base = {
    name: type.name,
    description: type.description ?? undefined,
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
}

export function serializeDirective(directive: GraphQLDirective): GraphqlDirectiveData {
  return {
    name: directive.name,
    description: directive.description ?? undefined,
    locations: [...directive.locations],
    args: directive.args.length > 0 ? directive.args.map(serializeArgument) : undefined,
    isRepeatable: directive.isRepeatable || undefined,
  };
}
