/* eslint-disable @typescript-eslint/no-explicit-any */
import { it } from 'vitest';

// Benchmark, not a test: SEARCH_BENCH=1 npx vitest run src/services/search/__tests__/query-split.test.ts (inside redoc/).
const bench = process.env.SEARCH_BENCH ? it : it.skip;
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

import { prepareApiDocs } from '../../../RedocStandalone.js';
import { ApiDocsSearchIndexer } from '../indexer/index.js';
import { SearchEngine } from '../engine/index.js';
import { SEARCH_CANDIDATE_LIMIT, SEARCH_LIMIT } from '../engine/constants.js';
import { otherMessageMatches, resolveMatch } from '../engine/match.js';
import { scoreMatch } from '../engine/score.js';
import { collapseSharedFields } from '../engine/collapse.js';
import { prepareHighlight, resolveDeepLink } from '../engine/present.js';

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const ms = (x: number) => x.toFixed(2).padStart(7);

bench('query split', async () => {
  const definition = JSON.parse(
    readFileSync(process.env.SEARCH_BENCH_SPEC ?? '../playground/specs/test.json', 'utf8'),
  );
  const prepared = await prepareApiDocs({
    definition,
    specType: 'openapi',
    basePath: '/docs',
  } as never);
  const heapBefore = process.memoryUsage().heapUsed;
  const t0 = performance.now();
  const indexer = new ApiDocsSearchIndexer(
    '/docs',
    prepared.store.schemaStore,
    prepared.document as Record<string, unknown>,
  );
  const addAll = (list: any[], ancestors: string[]) => {
    for (const item of list) {
      indexer.addItem(item, ancestors);
      if (item.items?.length)
        addAll(item.items, item.label ? [...ancestors, item.label] : ancestors);
    }
  };
  addAll(prepared.items as any[], []);
  const searchDocuments = indexer.getResult();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engine: any = new SearchEngine();
  for (const document of searchDocuments) engine.addDocument(document);
  const buildMs = performance.now() - t0;
  const heapMb = ((process.memoryUsage().heapUsed - heapBefore) / 1024 / 1024).toFixed(0);
  const docs: any[] = [...engine._documents.values()];
  const params = docs.reduce((n, d) => n + (d.parameters?.length ?? 0), 0);
  const longDesc =
    docs
      .flatMap((d) => d.parameters ?? [])
      .map((p: any) => String(p.description ?? ''))
      .find((s) => s.split(' ').length >= 8 && s.length < 120) ?? 'status';
  const title = docs.find((d) => d.title && d.title.split(' ').length >= 2)?.title ?? docs[0].title;
  const queries = ['id', 'customer', 'order status', title, longDesc, 'zqxjv'];
  console.log(
    `docs=${docs.length} params=${params} build=${buildMs.toFixed(0)}ms heap+${heapMb}MB candidateLimit=${SEARCH_CANDIDATE_LIMIT} limit=${SEARCH_LIMIT}`,
  );
  console.log('query'.padEnd(46), 'cands', '  index', '  match', 'collap', ' finish', '  total');
  for (const q of queries) {
    const stage = {
      index: [] as number[],
      match: [] as number[],
      collapse: [] as number[],
      finish: [] as number[],
      total: [] as number[],
    };
    let cands = 0;
    for (let run = 0; run < 18; run++) {
      const a = performance.now();
      const ids = new Set<string>();
      for (const r of engine._index.search(q, { limit: SEARCH_CANDIDATE_LIMIT }))
        for (const id of r.result) ids.add(id);
      const b = performance.now();
      // Mirror SearchEngine.search() stage by stage using its private helpers.
      const parsedQuery = {
        text: q.toLowerCase().trim(),
        words: q.toLowerCase().trim().split(/\s+/g).filter(Boolean),
        wordPatterns: q
          .toLowerCase()
          .trim()
          .split(/\s+/g)
          .filter(Boolean)
          .map((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')),
      };
      const confirmed: any[] = [];
      const folded: any[] = [];
      for (const id of ids) {
        const document = engine._documents.get(id);
        if (!document) continue;
        const page = engine._lowerDocuments.get(document.id);
        const match = resolveMatch(page, document, parsedQuery);
        const candidate = {
          document,
          match,
          score: scoreMatch(page, document, match, parsedQuery),
        };
        (match.fields.length ? confirmed : folded).push(candidate);
        if (!match.fields.length) continue;
        for (const pm of otherMessageMatches(page, document, match, parsedQuery)) {
          const extra = {
            fields: ['parameters'],
            parameter: pm.parameter,
            parameterScore: pm.score,
          };
          confirmed.push({
            document,
            match: extra,
            score: scoreMatch(page, document, extra, parsedQuery),
          });
        }
      }
      const c = performance.now();
      const ranked = confirmed.length ? confirmed : folded;
      ranked.sort((x, y) => y.score - x.score);
      const lowered = (d: any) => engine._lowerDocuments.get(d.id);
      const collapsed = collapseSharedFields(ranked, parsedQuery, lowered).slice(0, SEARCH_LIMIT);
      const d = performance.now();
      collapsed.map(({ document, match }: any) => ({
        document: resolveDeepLink(lowered(document), document, match, parsedQuery),
        highlight: prepareHighlight(document, q, match),
      }));
      const e = performance.now();
      await engine.search(q);
      const f = performance.now();
      if (run >= 3) {
        stage.index.push(b - a);
        stage.match.push(c - b);
        stage.collapse.push(d - c);
        stage.finish.push(e - d);
        stage.total.push(f - e);
      }
      cands = ids.size;
    }
    console.log(
      q.slice(0, 44).padEnd(46),
      String(cands).padStart(5),
      ms(median(stage.index)),
      ms(median(stage.match)),
      ms(median(stage.collapse)),
      ms(median(stage.finish)),
      ms(median(stage.total)),
    );
  }
}, 120_000);
