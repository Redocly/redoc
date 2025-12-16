import type { CodeSamplesConfig } from '../services/index.js';

export interface CodeSampleOptions {
  generatedPayloadSamplesMaxDepth: number;
  onlyRequiredInSamples: boolean;
  codeSamples?: CodeSamplesConfig;
}
