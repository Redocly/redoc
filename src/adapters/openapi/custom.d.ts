type GenericObject = Record<string, unknown>;
type ExtendedError = Error & {
  code?: string;
};

type Maybe<T> = undefined | null | T;

