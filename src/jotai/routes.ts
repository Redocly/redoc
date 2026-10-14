import { atom } from 'jotai';

import type { RouteIndex } from '../utils/routing.js';

export const routeIndexAtom = atom<RouteIndex | null>(null);
