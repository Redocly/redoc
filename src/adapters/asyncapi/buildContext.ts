import type { AsyncApiBuildContext as BuildContext } from '../../types/asyncapi.js';

import { createScopedContext } from '../scopedContext.js';

export const asyncApiContext = createScopedContext<BuildContext>('AsyncAPI');
