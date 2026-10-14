import type { EventPayload } from '@redocly/redoc-opentelemetry';

type ErrorDetails = NonNullable<EventPayload<'com.redocly.error.occurred'>[0]['details']>;
type ErrorName = NonNullable<ErrorDetails['name']>;

const KNOWN_NAME_FLAGS: Record<Exclude<ErrorName, 'other'>, true> = {
  TypeError: true,
  RangeError: true,
  ReferenceError: true,
  SyntaxError: true,
  URIError: true,
  Error: true,
};

/** URLs and absolute file paths. */
const LOCATION_PATTERN = /[a-z][a-z0-9+.-]{0,63}:\/\/\S+|(?:[A-Za-z]:)?(?:[\\/][\w.@%-]+){2,}/g;

const MESSAGE_MAX = 200;
const STACK_MAX = 2000;

function strip(text: string): string {
  return text.replace(LOCATION_PATTERN, '<path>');
}

export function sanitizeErrorDetails(error: Error, componentStack?: string | null): ErrorDetails {
  const stack = componentStack ?? error.stack ?? '';
  return {
    name: (Object.hasOwn(KNOWN_NAME_FLAGS, error.name) ? error.name : 'other') as ErrorName,
    stackFrames: stack.split('\n').filter((line) => /^\s*(at |in )/.test(line)).length,
    message: strip(error.message).slice(0, MESSAGE_MAX),
    ...(stack ? { stack: strip(stack).slice(0, STACK_MAX) } : {}),
  };
}
