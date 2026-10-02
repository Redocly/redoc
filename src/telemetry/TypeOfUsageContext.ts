import { createContext } from 'react';

import type { TypeOfUsage } from './RedocTelemetry.js';

/** How the page embeds Redoc: `init()` provides `html` or `docker`, `hydrate()` provides `cli`. */
export const TypeOfUsageContext = createContext<TypeOfUsage | undefined>(undefined);
