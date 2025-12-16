import type { LayoutVariant } from '@redocly/config';
import type { Options } from '../services/config-options/types.js';
import type { RouterType } from '../types/index.js';
import type { OpenAPIParser } from '../services/OpenAPIParser.js';

export interface RoutingProps {
  /**
   * Only applies when using `history`-based routing. (See the `router` prop.) Specifies the base path under which
   * all API component controlled pages are located. The host must route any location under this path to the API component.
   */
  basePath?: string;

  /**
   * Only applies when using `static`-based routing. (See the `router` prop.) Specifies the current static path
   * that is being rendered by the StaticRouter, which allows us to properly render the currently active route
   * on the server and already render the content instead of sending an empty page to the client.
   */
  staticRouterPath?: string;

  /**
   * Which routing solution to use when the user navigates using the table of contents.
   * Only applies when using the *sidebar* layout.
   *
   * - **`history`** - The table of contents pushes entries onto the navigation stack, e.g. `location.pushState`.
   *   This requires that the host routes any location under `basePath` (see `basePath` prop) to the API component.
   * - **`hash`** - Navigation happens using hash-fragments (`/some/page#these-fragments-here`).
   *   This still allows the user to link to individual pages without requiring the more complex routing setup `history` needs.
   * - **`memory`** - Internal navigation does not change the host `location` at all.
   *   This works in every scenario, but it lacks the important feature of being able to link to individual pages.
   * - **`static`** - Renders a single static page for the provided `staticRouterPath`.
   *   This can be used when the page is being rendered on the server (either SSR or SSG) to pre-generate the
   *   markup of the page, which can be rehydrated on the client. This can reduce the amount of time spent rendering
   *   the page on the client.
   *
   *   @default "history"
   */
  router?: RouterType;

  /**
   * Either uses the app's own or the parent router ex. (Portal).
   *
   *   @default false
   */
  disableRouter?: boolean;
}

export interface StoreProps {
  options: Options;
  layout: LayoutVariant;
  collapsedSidebar: boolean;
  parser: OpenAPIParser;
}
