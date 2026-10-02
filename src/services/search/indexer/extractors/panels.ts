import { hasRbacScope } from '../../../../adapters/rbac.js';

import type {
  ContainerNode,
  EmailPanelItem,
  ExternalLinkPanelItem,
  InfoMetadataNode,
  KeyValuePanelItem,
  ServersPanelItem,
} from '../../../../types/content.js';
import type { ExtractContext } from './context.js';

import { panelKind } from '../../../../types/common.js';
import { makeParam } from '../param.js';
import { METADATA_PLACE, OVERVIEW_PLACE, SERVER_PLACE, SERVER_VARIABLES_PLACE } from '../places.js';
import { addRow, describe } from './context.js';

type Flags = { isMockServer?: boolean };
type ServerVariables = ServersPanelItem['servers'][number]['variables'];

/** One row per server variable, on the overview page only, so a variable leads to the servers panel there. */
export function extractServerVariableRows(variables: ServerVariables, ctx: ExtractContext): void {
  if (!ctx.isOverview) return;
  for (const [name, variable] of Object.entries(variables ?? {})) {
    addRow(
      ctx,
      makeParam({
        name,
        description: [
          describe(ctx, variable.description),
          variable.default ? `default ${variable.default}` : '',
          variable.enum?.length ? `enum: ${variable.enum.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join(' '),
        place: SERVER_VARIABLES_PLACE,
        type: 'unknown',
      }),
    );
  }
}

/** Rows for the side panels of a page: servers, and the info attributes (contact, license, terms). */
export function extractPanelRows(container: ContainerNode, ctx: ExtractContext): void {
  for (const panel of container.panels ?? []) {
    for (const child of panel.children ?? []) {
      switch (child.kind) {
        case panelKind.SERVERS:
          for (const server of (child as ServersPanelItem).servers) {
            const flags = server as Flags;
            if (flags.isMockServer || hasRbacScope(flags)) continue;
            addRow(
              ctx,
              makeParam({
                name: server.name ?? server.url,
                description: [server.name ? server.url : '', describe(ctx, server.description)]
                  .filter(Boolean)
                  .join(' '),
                place: SERVER_PLACE,
                type: 'unknown',
              }),
            );
            extractServerVariableRows(server.variables, ctx);
          }
          break;
        case panelKind.ATTRIBUTE: {
          const item = child as KeyValuePanelItem;
          addRow(
            ctx,
            makeParam({
              name: item.title ?? item.label,
              description: item.value,
              place: OVERVIEW_PLACE,
              type: 'unknown',
            }),
          );
          break;
        }
        case panelKind.EXTERNAL_LINK: {
          const item = child as ExternalLinkPanelItem;
          addRow(
            ctx,
            makeParam({
              name: item.title ?? item.label,
              description: [item.title ? item.label : '', item.url].filter(Boolean).join(' '),
              place: OVERVIEW_PLACE,
              type: 'unknown',
            }),
          );
          break;
        }
        case panelKind.EMAIL: {
          const item = child as EmailPanelItem;
          addRow(
            ctx,
            makeParam({
              name: item.title ?? item.label,
              description: item.email,
              place: OVERVIEW_PLACE,
              type: 'unknown',
            }),
          );
          break;
        }
      }
    }
  }
}

/** One row per key/value of the overview's `x-metadata` table. */
export function extractInfoMetadataRows(node: InfoMetadataNode, ctx: ExtractContext): void {
  for (const row of node.rows) {
    addRow(
      ctx,
      makeParam({ name: row.key, description: row.value, place: METADATA_PLACE, type: 'unknown' }),
    );
  }
}
