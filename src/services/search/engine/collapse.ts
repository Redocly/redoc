import type { SearchDocument } from '../types.js';
import type { LowerDocument } from './lowered.js';
import type { Candidate, ParsedQuery } from './types.js';

import { SHARED_FIELD_COPIES } from './constants.js';
import { coverage } from './query.js';
import { lowerText } from './text.js';

export type LoweredLookup = (document: SearchDocument) => LowerDocument;

export function collapseSharedFields(
  candidates: Candidate[],
  query: ParsedQuery,
  lowered: LoweredLookup,
): Candidate[] {
  const groups = new Map<string, Candidate[]>();

  candidates.forEach((candidate) => {
    const key = sharedFieldKey(candidate, query, lowered);
    if (!key) return;
    const group = groups.get(key);
    if (group) group.push(candidate);
    else groups.set(key, [candidate]);
  });

  const dropped = new Set<Candidate>();
  for (const group of groups.values()) {
    group.sort((a, b) => (isMoreCanonical(a, b) ? -1 : isMoreCanonical(b, a) ? 1 : 0));
    const [canonical, ...rest] = group;
    if (!canonical.document.isSchemaDefinition) continue;
    canonical.score = Math.max(...group.map((candidate) => candidate.score));
    rest.sort(
      (a, b) =>
        Number(!!a.document.isSchemaDefinition) - Number(!!b.document.isSchemaDefinition) ||
        b.score - a.score,
    );
    for (const extra of rest.slice(SHARED_FIELD_COPIES)) dropped.add(extra);
  }

  const collapsed = candidates.filter((candidate) => !dropped.has(candidate));
  collapsed.sort((a, b) => b.score - a.score);
  return collapsed;
}

function sharedFieldKey(
  candidate: Candidate,
  query: ParsedQuery,
  lowered: LoweredLookup,
): string | undefined {
  const { document, match } = candidate;
  if (!match.fields.includes('parameters')) return undefined;

  const description = lowerText(match.parameter?.description).trim();
  if (!description) return undefined;

  const page = lowered(document);
  const fieldCoverage = coverage(query, description);
  const pageCoverage = Math.max(
    coverage(query, page.title),
    coverage(query, page.text),
    coverage(query, page.httpPath),
    coverage(query, page.path),
  );
  if (pageCoverage >= fieldCoverage) return undefined;

  return `${lowerText(match.parameter?.name)}\u0000${description}`;
}

function isMoreCanonical(candidate: Candidate, current: Candidate): boolean {
  if (!!candidate.document.isSchemaDefinition !== !!current.document.isSchemaDefinition) {
    return !!candidate.document.isSchemaDefinition;
  }
  const candidateDepth = candidate.match.parameter?.path?.length ?? 0;
  const currentDepth = current.match.parameter?.path?.length ?? 0;
  if (candidateDepth !== currentDepth) return candidateDepth < currentDepth;
  return candidate.score > current.score;
}
