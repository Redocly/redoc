import { Kind, OperationTypeNode, parse, print, visit } from 'graphql';

import type {
  ASTNode,
  DefinitionNode,
  DirectiveDefinitionNode,
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  OperationTypeDefinitionNode,
  SchemaDefinitionNode,
  SchemaExtensionNode,
  TypeDefinitionNode,
  TypeExtensionNode,
} from 'graphql';
import type { GraphqlItemScope, GraphqlOperationType, SpecSliceScope } from './types.js';

const TYPE_DEFINITION_KINDS: ReadonlySet<string> = new Set([
  Kind.SCALAR_TYPE_DEFINITION,
  Kind.OBJECT_TYPE_DEFINITION,
  Kind.INTERFACE_TYPE_DEFINITION,
  Kind.UNION_TYPE_DEFINITION,
  Kind.ENUM_TYPE_DEFINITION,
  Kind.INPUT_OBJECT_TYPE_DEFINITION,
]);

const TYPE_EXTENSION_KINDS: ReadonlySet<string> = new Set([
  Kind.SCALAR_TYPE_EXTENSION,
  Kind.OBJECT_TYPE_EXTENSION,
  Kind.INTERFACE_TYPE_EXTENSION,
  Kind.UNION_TYPE_EXTENSION,
  Kind.ENUM_TYPE_EXTENSION,
  Kind.INPUT_OBJECT_TYPE_EXTENSION,
]);

function isTypeDefinition(def: DefinitionNode): def is TypeDefinitionNode {
  return TYPE_DEFINITION_KINDS.has(def.kind);
}

function isTypeExtension(def: DefinitionNode): def is TypeExtensionNode {
  return TYPE_EXTENSION_KINDS.has(def.kind);
}

const OPERATION_TYPE_NODE: Record<GraphqlOperationType, OperationTypeNode> = {
  query: OperationTypeNode.QUERY,
  mutation: OperationTypeNode.MUTATION,
  subscription: OperationTypeNode.SUBSCRIPTION,
};

const OPERATION_TYPE_ORDER: GraphqlOperationType[] = ['query', 'mutation', 'subscription'];

const DEFAULT_ROOT_NAMES: Record<GraphqlOperationType, string> = {
  query: 'Query',
  mutation: 'Mutation',
  subscription: 'Subscription',
};

type SdlIndex = {
  typeDefs: Map<string, TypeDefinitionNode>;
  typeExts: Map<string, TypeExtensionNode[]>;
  directiveDefs: Map<string, DirectiveDefinitionNode>;
  schemaDef?: SchemaDefinitionNode;
  schemaExts: SchemaExtensionNode[];
};

type SliceSeeds = {
  typeNames: string[];
  directiveNames: string[];
  operationFields: Map<GraphqlOperationType, string[]>;
};

function indexDefinitions(doc: DocumentNode): SdlIndex {
  const index: SdlIndex = {
    typeDefs: new Map(),
    typeExts: new Map(),
    directiveDefs: new Map(),
    schemaExts: [],
  };
  for (const def of doc.definitions) {
    if (isTypeDefinition(def)) {
      index.typeDefs.set(def.name.value, def);
    } else if (isTypeExtension(def)) {
      const name = def.name.value;
      const list = index.typeExts.get(name) ?? [];
      list.push(def);
      index.typeExts.set(name, list);
    } else if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      index.directiveDefs.set(def.name.value, def);
    } else if (def.kind === Kind.SCHEMA_DEFINITION) {
      index.schemaDef = def;
    } else if (def.kind === Kind.SCHEMA_EXTENSION) {
      index.schemaExts.push(def);
    }
  }
  return index;
}

function collectSeeds(scope: SpecSliceScope): SliceSeeds | undefined {
  const seeds: SliceSeeds = { typeNames: [], directiveNames: [], operationFields: new Map() };

  const addMember = (member: GraphqlItemScope): void => {
    if (member.kind === 'graphql-type') {
      seeds.typeNames.push(member.name);
    } else if (member.kind === 'graphql-directive') {
      seeds.directiveNames.push(member.name);
    } else {
      const fields = seeds.operationFields.get(member.operationType) ?? [];
      fields.push(member.name);
      seeds.operationFields.set(member.operationType, fields);
    }
  };

  if (
    scope.kind === 'graphql-type' ||
    scope.kind === 'graphql-directive' ||
    scope.kind === 'graphql-operation'
  ) {
    addMember(scope);
    return seeds;
  }
  if (scope.kind === 'graphql-group') {
    scope.members.forEach(addMember);
    return seeds;
  }
  return undefined;
}

function findRootTypeName(index: SdlIndex, operationType: GraphqlOperationType): string {
  const wanted = OPERATION_TYPE_NODE[operationType];
  for (const def of [index.schemaDef, ...index.schemaExts]) {
    for (const entry of def?.operationTypes ?? []) {
      if (entry.operation === wanted) return entry.type.name.value;
    }
  }
  return DEFAULT_ROOT_NAMES[operationType];
}

function collectRootFields(
  index: SdlIndex,
  rootDef: ObjectTypeDefinitionNode,
  wanted: ReadonlySet<string>,
): FieldDefinitionNode[] {
  const fields: FieldDefinitionNode[] = [];
  const found = new Set<string>();
  const sources = [rootDef, ...(index.typeExts.get(rootDef.name.value) ?? [])];
  for (const source of sources) {
    if (source.kind !== Kind.OBJECT_TYPE_DEFINITION && source.kind !== Kind.OBJECT_TYPE_EXTENSION) {
      continue;
    }
    for (const field of source.fields ?? []) {
      const name = field.name.value;
      if (wanted.has(name) && !found.has(name)) {
        found.add(name);
        fields.push(field);
      }
    }
  }
  return fields;
}

export function extractGraphqlSlice(sdl: string, scope: SpecSliceScope): string | undefined {
  const seeds = collectSeeds(scope);
  if (!seeds) return undefined;

  let doc: DocumentNode;
  try {
    doc = parse(sdl, { noLocation: true });
  } catch {
    return undefined;
  }
  const index = indexDefinitions(doc);

  const trimmedRoots = new Map<string, ObjectTypeDefinitionNode>();
  const schemaEntries: OperationTypeDefinitionNode[] = [];
  let hasNonDefaultRootName = false;

  for (const operationType of OPERATION_TYPE_ORDER) {
    const fieldNames = seeds.operationFields.get(operationType);
    if (!fieldNames?.length) continue;
    const rootName = findRootTypeName(index, operationType);
    const rootDef = index.typeDefs.get(rootName);
    if (rootDef?.kind !== Kind.OBJECT_TYPE_DEFINITION) continue;
    const fields = collectRootFields(index, rootDef, new Set(fieldNames));
    if (!fields.length) continue;
    const existing = trimmedRoots.get(rootName);
    trimmedRoots.set(rootName, {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      name: rootDef.name,
      description: rootDef.description,
      directives: rootDef.directives,
      fields: existing ? [...(existing.fields ?? []), ...fields] : fields,
    });
    schemaEntries.push({
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation: OPERATION_TYPE_NODE[operationType],
      type: { kind: Kind.NAMED_TYPE, name: { kind: Kind.NAME, value: rootName } },
    });
    if (rootName !== DEFAULT_ROOT_NAMES[operationType]) hasNonDefaultRootName = true;
  }

  const syntheticSchemaDef: SchemaDefinitionNode | undefined =
    schemaEntries.length && (index.schemaDef || hasNonDefaultRootName)
      ? {
          kind: Kind.SCHEMA_DEFINITION,
          description: index.schemaDef?.description,
          directives: index.schemaDef?.directives,
          operationTypes: schemaEntries,
        }
      : undefined;

  const keptTypes = new Set<string>();
  const keptDirectives = new Set<string>();
  const queue: ASTNode[] = [];

  const keepType = (name: string): void => {
    if (keptTypes.has(name)) return;
    const def = index.typeDefs.get(name);
    if (!def) return;
    keptTypes.add(name);
    const trimmed = trimmedRoots.get(name);
    if (trimmed) {
      queue.push(trimmed);
      return;
    }
    queue.push(def, ...(index.typeExts.get(name) ?? []));
  };

  const keepDirective = (name: string): void => {
    if (keptDirectives.has(name)) return;
    const def = index.directiveDefs.get(name);
    if (!def) return;
    keptDirectives.add(name);
    queue.push(def);
  };

  if (syntheticSchemaDef) queue.push(syntheticSchemaDef);
  for (const rootName of trimmedRoots.keys()) keepType(rootName);
  for (const name of seeds.typeNames) keepType(name);
  for (const name of seeds.directiveNames) keepDirective(name);

  if (keptTypes.size === 0 && keptDirectives.size === 0) return undefined;

  while (queue.length) {
    const node = queue.pop();
    if (!node) continue;
    visit(node, {
      NamedType(named) {
        keepType(named.name.value);
      },
      Directive(directive) {
        keepDirective(directive.name.value);
      },
    });
  }

  const definitions: DefinitionNode[] = [];
  let insertedSchemaDef = false;
  for (const def of doc.definitions) {
    if (def.kind === Kind.SCHEMA_DEFINITION) {
      if (syntheticSchemaDef) {
        definitions.push(syntheticSchemaDef);
        insertedSchemaDef = true;
      }
    } else if (isTypeDefinition(def)) {
      const name = def.name.value;
      if (keptTypes.has(name)) {
        definitions.push(trimmedRoots.get(name) ?? def);
      }
    } else if (isTypeExtension(def)) {
      const name = def.name.value;
      if (keptTypes.has(name) && !trimmedRoots.has(name)) definitions.push(def);
    } else if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      if (keptDirectives.has(def.name.value)) definitions.push(def);
    }
  }
  if (syntheticSchemaDef && !insertedSchemaDef) definitions.unshift(syntheticSchemaDef);
  if (definitions.length === 0) return undefined;

  return print({ kind: Kind.DOCUMENT, definitions });
}
