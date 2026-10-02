import type { Node } from '@markdoc/markdoc';

export type AsyncMessageSubsection = 'payload' | 'headers' | 'bindings';

export type DescriptionFormatter = (desc: string | Node | Node[]) => string;

export type WalkScope = {
  callbackId?: string;
  messageKey?: string;
  pathOnly?: boolean;
};
