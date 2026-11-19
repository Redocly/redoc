import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, waitFor } from '@testing-library/react';

import type { ReactElement, ReactNode } from 'react';
import type { MarkdownAdapter } from '../contexts/markdownAdapter.js';
import type * as RedocTelemetryModule from '../telemetry/RedocTelemetry.js';
import type { RedocTelemetryConfig } from '../telemetry/RedocTelemetry.js';
import type { RawApiDocsOptions } from '../types/options.js';

import { RedocStandalone, prepareApiDocs } from '../RedocStandalone.js';
import { RedoclyApiDocs } from '../RedoclyApiDocs.js';
import { RedoclyApiDocsStandalone } from '../RedoclyApiDocsStandalone.js';
import { TELEMETRY_DISABLED_BY_DEFAULT } from '../telemetry/defaults.js';

const builtWith = vi.hoisted((): Partial<RedocTelemetryConfig>[] => []);

vi.mock('../telemetry/RedocTelemetry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof RedocTelemetryModule>();
  class RecordedRedocTelemetry extends actual.RedocTelemetry {
    constructor(config: RedocTelemetryConfig) {
      super(config);
      builtWith.push(config);
    }
  }
  return { ...actual, RedocTelemetry: RecordedRedocTelemetry };
});

function disabledFlags(): boolean[] {
  return builtWith.map((config) => config.disabled ?? TELEMETRY_DISABLED_BY_DEFAULT);
}

type Prepared = Awaited<ReturnType<typeof prepareApiDocs>>;

const SPEC = {
  openapi: '3.1.0',
  info: { title: 'Telemetry', version: '1.0.0' },
  paths: {},
};

const markdownAdapter: MarkdownAdapter = {
  parse: (source) => source,
  render: () => null as ReactNode,
};

const LOW_LEVEL_COMPONENTS: [string, (prepared: Prepared) => ReactElement][] = [
  [
    'Redoc',
    (prepared) => (
      <RedoclyApiDocs
        items={prepared.items}
        store={prepared.store}
        options={prepared.options}
        basePath="/"
        markdownAdapter={markdownAdapter}
      />
    ),
  ],
  [
    'RedoclyApiDocsStandalone',
    (prepared) => (
      <RedoclyApiDocsStandalone
        items={prepared.items}
        store={prepared.store}
        options={prepared.options}
        basePath="/"
      />
    ),
  ],
];

async function telemetryDisabledFlags(
  options: Partial<RawApiDocsOptions>,
  renderDocs: (prepared: Prepared) => ReactElement,
): Promise<unknown[]> {
  const prepared = await prepareApiDocs({ spec: structuredClone(SPEC), options });
  await act(async () => {
    render(renderDocs(prepared));
  });
  return disabledFlags();
}

beforeEach(() => {
  builtWith.length = 0;
});

afterEach(() => {
  cleanup();
});

describe.each(LOW_LEVEL_COMPONENTS)('%s rendered from prepareApiDocs', (_, renderDocs) => {
  it('sends telemetry by default', async () => {
    expect(await telemetryDisabledFlags({}, renderDocs)).toEqual([false]);
  });

  it('turns telemetry off with disableTelemetry in the prepared options', async () => {
    expect(await telemetryDisabledFlags({ disableTelemetry: true }, renderDocs)).toEqual([true]);
  });
});

describe('RedocStandalone', () => {
  it('follows disableTelemetry when it changes without a new spec', async () => {
    const spec = structuredClone(SPEC);
    const { rerender } = render(
      <RedocStandalone spec={spec} options={{ disableTelemetry: true }} />,
    );
    await waitFor(() => expect(disabledFlags()).toEqual([true]));

    builtWith.length = 0;
    await act(async () => {
      rerender(<RedocStandalone spec={spec} options={{ disableTelemetry: false }} />);
    });
    expect(disabledFlags()).toEqual([false]);

    builtWith.length = 0;
    await act(async () => {
      rerender(<RedocStandalone spec={spec} options={{ disableTelemetry: true }} />);
    });
    expect(disabledFlags()).toEqual([true]);
  });
});
