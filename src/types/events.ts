import type { Operation } from './options.js';

export type AnalyticsEventType =
  | 'CodeSampleLanguageSwitched'
  | 'CodeSampleCopied'
  | 'OperationServerExpanded'
  | 'TargetServerSwitched';

export type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  resource:
    | 'Redocly_CodeSample'
    | 'Redocly_Operation';
  action:
    | 'LanguageSwitched'
    | 'CodeSampleCopied'
    | 'TargetServerSwitched';
  operationId?: string;
  operationPath: string;
  operationHttpVerb: string;
  operationSummary?: string | Record<string, unknown>;
};

export type CodeSamplesLanguageSwitchedEvent = AnalyticsEvent & {
  lang: string;
  label: string;
  exampleId?: string;
};

export type CodeSamplesCopiedEvent = AnalyticsEvent & {
  lang: string;
  label: string;
  type: 'request' | 'response';
  exampleId?: string;
  exampleMimeType?: string;
};

export type TargetServerSwitchedEvent = AnalyticsEvent & {
  serverUrl: string;
};


export type Events = {
  codeSamplesLanguageSwitch?: (event: CodeSamplesLanguageSwitchedEvent) => void;
  codeSamplesCopy?: (event: CodeSamplesCopiedEvent) => void;
  targetServerSwitch?: (event: TargetServerSwitchedEvent) => void;
};

export type LanguageSwitchProps = {
  operation: Operation;
  sample: Record<string, unknown>;
};

export type CodeSampleCopyProps = {
  operation: Operation;
  lang?: string;
  label?: string;
  type: 'request' | 'response';
  exampleId?: string;
  activeExampleName?: string;
  activeMimeName: string;
};

export type TargetServerSwitchProps = {
  operation: Operation;
  serverUrl: string;
};

