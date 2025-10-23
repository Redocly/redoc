import type { ReactElement } from 'react';
import type { HookConfig, HookRawHtml } from '../../services/index.js';
import type { SchemaModel } from '../../models/index.js';

export function RenderHook<T>(props: { Hook?: HookConfig<T>; props: T }): ReactElement | null {
  if (!props.Hook) return null;
  const hookResult = props.Hook(props.props);
  const html = hookResult && (hookResult as HookRawHtml).html;
  if (html) {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } else {
    return hookResult as ReactElement;
  }
}

export function getAccessModeLabelText(schema: SchemaModel): string | null {
  return (schema.readOnly && 'read-only') || (schema.writeOnly && 'write-only') || null;
}
