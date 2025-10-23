import { cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';

import type { PropsWithChildren, ReactElement } from 'react';
import type {
  AppProviderProps,
  RedoclyOpenAPIDocsProps,
  RedoclyOpenAPIDocsStandaloneProps,
} from './types.js';
import type { OpenAPIDefinition } from '../../types/index.js';
import type { OpenAPIParser } from '../../services/index.js';
import type { RedocConfig } from '@redocly/config';

import { Loading } from '@redocly/theme/components/Loaders/Loading';

import { useDeepCompareMemoize, fixSpec } from './utils.js';
import { argValueToBoolean } from '../../utils/index.js';
import { RedoclyOpenAPIDocs } from './RedoclyOpenAPIDocs.js';
import { loadAndBundleDefinition, loadOpenapiConfig } from '../../utils/loadAndBundleSpec.js';
import { ErrorPage } from './Error.js';

export async function loadSingle(spec, specUrl, options?: RedocConfig): Promise<OpenAPIDefinition> {
  let resolvedDefinition: OpenAPIDefinition;
  if (options?.skipBundle) {
    if (!spec) {
      throw new Error('spec must be specified when using "skipBundleAndConvert"');
    }
    resolvedDefinition = spec as OpenAPIDefinition;
  } else {
    resolvedDefinition = await loadAndBundleDefinition(spec || specUrl);
  }

  try {
    fixSpec(resolvedDefinition);
  } catch {
    // nope
  }
  return resolvedDefinition;
}

export function loadAndBundleSpecOrMd(url: string, title?: string) {
  if (url.endsWith('.md')) {
    return loadAndBundleDefinition({
      openapi: '3.0.0',
      info: {
        title: title || '',
        version: '1.0',
        description: { $ref: url },
      },
      paths: {},
    });
  } else {
    return loadAndBundleDefinition(url);
  }
}

export const AppProvider = ({
  options,
  definitionUrl,
  definition,
  activeSampleLanguage,
  children,
}: PropsWithChildren<AppProviderProps>): ReactElement | null => {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const [loadedSpec, setLoadedSpec] = useState<OpenAPIDefinition | OpenAPIParser | null>(null);
  const [redoclyOptions, setRedoclyOptions] = useState<RedocConfig>(options || {});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const config = await loadOpenapiConfig();
        setRedoclyOptions({ ...options, ...config });
        setLoadedSpec(await loadSingle(definition, definitionUrl, options));
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, [definition, definitionUrl, options]); // do not reload based on options

  const store = useMemo(
    () => {
      if (!loadedSpec) return undefined;
      return {
        definition: loadedSpec,
        options: redoclyOptions,
        definitionUrl,
        activeSampleLanguage,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDeepCompareMemoize([loadedSpec, definitionUrl, redoclyOptions]),
  );

  useEffect(() => {
    if (!store) return;
    setLoading(false);
  }, [store]);

  if (error) {
    return (
      <ErrorPage
        typeOfUsage="react"
        description={error || 'Please check path to your OpenAPI description'}
      />
    );
  }

  if (!store) {
    return null;
  }

  return !loading ? (
    isValidElement(children) ? (
      cloneElement(children, { store } as unknown as RedoclyOpenAPIDocsProps)
    ) : null
  ) : argValueToBoolean(options?.hideLoading, false) ? null : (
    <Loading color="--loading-spinner-color" />
  );
};

export function RedoclyOpenAPIDocsStandalone({
  definition,
  definitionUrl,
  disableTelemetry = false,
  options = {},
  activeItemId,
  activeSampleLanguage,
  activeDeepLink,
  router,
  typeOfUsage = 'react',
}: RedoclyOpenAPIDocsStandaloneProps): ReactElement {
  return (
    <AppProvider
      definition={definition}
      definitionUrl={definitionUrl}
      options={options}
      activeItemId={activeItemId}
      activeSampleLanguage={activeSampleLanguage}
      activeDeepLink={activeDeepLink}
    >
      <RedoclyOpenAPIDocs
        withCommonStyles={true}
        router={router || 'hash'}
        disableTelemetry={disableTelemetry}
        typeOfUsage={typeOfUsage}
      />
    </AppProvider>
  );
}
