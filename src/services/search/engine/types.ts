import type { OperationParameter, SearchDocument } from '../types.js';

export type ParsedQuery = { text: string; words: string[] };

export type DocumentMatch = {
  fields: string[];
  parameter: OperationParameter | undefined;
  parameterScore: number;
};

export type Candidate = { document: SearchDocument; match: DocumentMatch; score: number };

export type ParameterHit = { parameter: OperationParameter; score: number };
