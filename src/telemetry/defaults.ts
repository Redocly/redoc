import type { TypeOfUsage } from './RedocTelemetry.js';

export const TELEMETRY_DISABLED_BY_DEFAULT = false;

export const DEFAULT_SERVICE_NAME = 'redoc-ce';

export const DEFAULT_TYPE_OF_USAGE: TypeOfUsage | undefined = 'react';

/** Page identifier used by page-level events and as the PageResource of UI events; `undefined` means `location.href`. */
export const PAGE_URI: string | undefined = 'urn:redocly:redoc:ui:page';

export const PAGE_VIEWED_PER_ROUTE = true;
