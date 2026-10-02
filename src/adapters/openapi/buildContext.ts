import type { OpenApiBuildContext as BuildContext } from '../../types/openapi.js';

import { createScopedContext } from '../scopedContext.js';

export const openApiContext = createScopedContext<BuildContext>('OpenAPI');
