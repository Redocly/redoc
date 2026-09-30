import type { OperationParameter } from '@redocly/theme/core/openapi';
import type { Node } from '@markdoc/markdoc';
import type { ItemContentNode } from '../../../../types/content.js';
import type { ExampleEntry } from '../../../../types/store.js';
import type { SchemaWalker } from '../schema-walker.js';
import type { DescriptionFormatter, WalkScope } from '../context.js';

import { getParameterId } from '../param.js';

export type ExtractContext = {
  slug: string;
  scope: WalkScope;
  paramsMap: Record<string, OperationParameter>;
  visited: Set<string>;
  walker: SchemaWalker;
  formatDescription: DescriptionFormatter;
  hasSchemas: boolean;
  exampleStore?: Record<string, ExampleEntry>;
  /** True on the API overview page; parts that should lead there only are gated on it. */
  isOverview: boolean;
};

export type Extractor = {
  matches(node: ItemContentNode): boolean;
  extract(node: ItemContentNode, ctx: ExtractContext): void;
};

export function addRow(ctx: ExtractContext, param: OperationParameter): void {
  ctx.paramsMap[getParameterId(param, ctx.scope.callbackId)] = param;
}

export function describe(ctx: ExtractContext, desc: string | Node | Node[] | undefined): string {
  return desc ? ctx.formatDescription(desc) : '';
}

export function withScope(ctx: ExtractContext, scope: Partial<WalkScope>): ExtractContext {
  return { ...ctx, scope: { ...ctx.scope, ...scope } };
}
