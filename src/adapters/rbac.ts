// The open-source build attaches no access scopes, so every reader is a no-op.

export type RbacScope = Record<string, string>;

export function readRbacScope(_source: unknown): RbacScope | undefined {
  return undefined;
}

export function hasRbacScope(_source: unknown): boolean {
  return false;
}

export type RbacProp = Record<never, never>;

export function rbacProp(_scope: RbacScope | undefined): RbacProp {
  return {};
}

export function isRbacKey(_key: string): boolean {
  return false;
}

export function splitRbacSection<T>(map: Record<string, T> | undefined): {
  sectionRbac: RbacScope | undefined;
  entries: [string, T][];
} {
  return { sectionRbac: undefined, entries: map ? Object.entries(map) : [] };
}
