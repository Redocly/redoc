import type { ReactElement, ComponentType } from 'react';
import type { Node, Schema, ConfigFunction } from '@markdoc/markdoc';

export type MarkdownProps = {
  sanitize?: boolean;
  base?: boolean;
  source?: string | GenericObject;
  ast?: Node[];
  className?: string;
  htmlWrap?: (part: ReactElement) => ReactElement;
  markdocOptions?: MarkdocOptions;
};

export type MarkdocOptions = {
  tags: Record<string, Schema>;
  nodes: Record<string, Schema>;
  components: Record<string, ComponentType>;
  variables?: Record<string, any>;
  partials?: Record<string, any>;
  functions?: Record<string, ConfigFunction>;
};
