import type { OperationParameter } from '@redocly/theme/core/openapi';

const MAX_INDEXED_EXAMPLE_LENGTH = 200;

export function makeParam(
  fields: Partial<OperationParameter> & { name: string | string[]; place: string },
): OperationParameter {
  return {
    description: '',
    mediaType: undefined,
    type: '',
    required: false,
    example: undefined,
    enum: undefined,
    ...fields,
  };
}

export function truncateIndexedExample(example: string): string {
  return example.length > MAX_INDEXED_EXAMPLE_LENGTH
    ? `${example.slice(0, MAX_INDEXED_EXAMPLE_LENGTH)}…`
    : example;
}

export function getParameterId(
  param: OperationParameter,
  callbackId?: string,
  messageKey?: string,
): string {
  return (
    [...(Array.isArray(param.path) ? param.path : []), param.name.toString()].join('.') +
    param.description +
    param.place +
    // Variant fields can differ only by their values; each keeps its row and its anchor.
    (param.enum?.join(',') ?? '') +
    (callbackId ?? '') +
    (messageKey ?? '')
  );
}
