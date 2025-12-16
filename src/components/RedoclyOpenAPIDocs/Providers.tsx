import { memo, useCallback, useEffect, useMemo } from 'react';
import markdocLib from '@markdoc/markdoc';
import { LayoutVariant } from '@redocly/config';
import { createStore, Provider } from 'jotai';

import type { PropsWithChildren } from 'react';
import type { StoreProviderProps } from './types.js';
import type { Options } from '../../services/index.js';

import { html } from '@redocly/theme/markdoc/tags/html';
import { Heading } from '@redocly/theme/markdoc/components/Heading/Heading';

import { normalizeOptions, OpenAPIParser } from '../../services/index.js';
import { SchemaDefinition } from '../SchemaDefinition/index.js';
import { McpTool } from '../McpTool/index.js';
import { getMarkdownHeaderId } from './utils.js';
import {
  appStore,
  appStoreOverrideAtom,
  disableTelemetryAtom,
  layoutAtom,
  routerAtom,
} from '../../jotai/app.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { getDefaultOperationStore, operationStore } from '../../jotai/operation.js';
import { telemetryAtom } from '../../jotai/telemetry.js';

const DEFAULT_OPTIONS = {
  // java.io.ObjectStreamField is something generated from java code which is too deep so our docs build crash because of RAM
  ignoreNamedSchemas: ['java.io.ObjectStreamField'],
  maxDisplayedEnumValues: 10,
  markdocOptions: {
    tags: {
      html: html.schema,
      schemaDefinition: {
        render: 'SchemaDefinition',
        attributes: {
          schemaRef: {
            type: String,
          },
          exampleRef: {
            type: String,
          },
          showReadOnly: {
            type: Boolean,
          },
          showWriteOnly: {
            type: Boolean,
          },
          htmlWrap: {
            type: String,
            default: false,
          },
        },
      },
      mcpTool: {
        render: 'McpTool',
        attributes: {
          toolName: {
            type: String,
          },
          id: {
            type: String,
          },
        },
      },
    },
    nodes: {
      heading: {
        children: ['inline'],
        attributes: {
          id: { type: String },
          level: { type: Number, required: true, default: 1 },
        },
        transform(node, config) {
          const attributes = node.transformAttributes(config);
          const children = node.transformChildren(config);

          const id =
            typeof attributes.id === 'string' ? attributes.id : getMarkdownHeaderId(children);

          return new markdocLib.Tag(
            'Heading',
            {
              ...attributes,
              id,
              level: node.attributes.level,
            },
            children,
          );
        },
      },
    },
    components: {
      SchemaDefinition: SchemaDefinition,
      McpTool: McpTool,
      Heading,
    },
  },
};

export const StoreProvider = memo(
  ({
    children,
    options: rawOptions,
    definitionUrl,
    definition,
    withState,
    router,
    disableTelemetry = false,
  }: PropsWithChildren<StoreProviderProps>) => {
    const createGlobalStore = useCallback((): {
      options: Options;
      parser: OpenAPIParser;
    } => {
      const options = normalizeOptions(rawOptions, DEFAULT_OPTIONS as any);
      const parser = new OpenAPIParser(definition, definitionUrl, options);

      return { options, parser };
    }, [definition, definitionUrl, rawOptions]);

    const globalStoreValue = useMemo(() => createGlobalStore(), [createGlobalStore]);

    const initializedStore = useMemo(() => {
      const store = createStore();

      store.set(globalStoreAtom, globalStoreValue);

      store.sub(appStore, () => undefined); // force mount so init data is read from storage
      // Set layout from withState (portal) or options (local), with correct priority
      store.set(
        layoutAtom,
        withState?.layout || globalStoreValue.options?.layout || LayoutVariant.THREE_PANEL,
      ); // set layout atom to update appStore atom with correct layout value
      store.set(routerAtom, router || 'hash');
      store.set(disableTelemetryAtom, disableTelemetry || false);
      store.set(telemetryAtom, { data: undefined, status: 'initializing' });

      if (withState) {
        store.set(appStoreOverrideAtom, {
          activeMimeName: withState.activeMimeName,
        });
      }

      if (withState?.operation) {
        const defaultStore = getDefaultOperationStore(
          withState.operation.pointer,
          withState.operation.state.requestValues,
          withState.operation.state.activeExampleName,
        );

        store.set(operationStore(withState.operation.pointer), defaultStore);
      }

      return store;
    }, [router, disableTelemetry, withState, globalStoreValue]);

    useEffect(() => {
      if (!withState?.layout) return;
      initializedStore.set(layoutAtom, withState?.layout);
    }, [initializedStore, withState?.layout]);

    return <Provider store={initializedStore}>{children}</Provider>;
  },
);
