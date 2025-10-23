import type { RedocConfig, LayoutVariant } from '@redocly/config';
import type { OpenAPIDefinition } from '../../types/index.js';
import type { RoutingProps, StoreProps } from '../../hoc/types.js';
import type { OperationStore } from '../../jotai/operation';

export interface RedoclyOpenAPIDocsProps extends RoutingProps, StoreProps {
  onLoaded?: () => void;
  store?: StoreProviderProps;
  withCommonStyles?: boolean;
  disableTelemetry?: boolean;
  typeOfUsage?: 'html' | 'cli' | 'react' | 'docker';
}

export interface StoreProviderProps {
  options?: RedocConfig;
  definition: OpenAPIDefinition;
  definitionUrl?: string;
  router?: 'hash' | 'history' | 'memory';
  disableTelemetry?: boolean;
  typeOfUsage?: 'html' | 'cli' | 'react' | 'docker';
  withState?: {
    activeMimeName?: string;
    layout?: LayoutVariant;
    operation?: {
      pointer: string;
      state: Partial<OperationStore>;
    };
  };
}

export interface AppProviderProps {
  definitionUrl?: string;
  disableTelemetry?: boolean;
  definition?: Record<string, any>;
  options?: RedocConfig;
  activeItemId?: string;
  activeSampleLanguage?: string;
  activeDeepLink?: string;
}

export interface RedoclyOpenAPIDocsStandaloneProps {
  definition?: Record<string, any>;
  definitionUrl?: string;
  disableTelemetry?: boolean;
  options?: RedocConfig;
  activeItemId?: string;
  activeSampleLanguage?: string;
  activeDeepLink?: string;
  router?: 'hash' | 'history';
  typeOfUsage?: 'html' | 'cli' | 'react' | 'docker';
}
