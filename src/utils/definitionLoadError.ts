export type DefinitionLoadStage = 'fetch' | 'parse' | 'bundle' | 'unsupported';

export class DefinitionLoadError extends Error {
  readonly stage: DefinitionLoadStage;
  readonly httpStatus: number | undefined;

  constructor(stage: DefinitionLoadStage, message: string, httpStatus?: number) {
    super(message);
    this.name = 'DefinitionLoadError';
    this.stage = stage;
    this.httpStatus = httpStatus;
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
