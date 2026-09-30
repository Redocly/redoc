// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AgentTool, AgentToolResult, AgentToolsTelemetry } from '../types.js';

import { getModelContext, registerAgentTools } from '../webmcp.js';

type RegisteredTool = {
  name: string;
  execute: (input: unknown, options?: { signal?: AbortSignal }) => Promise<AgentToolResult>;
};

function installModelContext(host: 'document' | 'navigator'): {
  tools: RegisteredTool[];
  signals: Array<AbortSignal | undefined>;
} {
  const tools: RegisteredTool[] = [];
  const signals: Array<AbortSignal | undefined> = [];

  Object.defineProperty(host === 'document' ? document : navigator, 'modelContext', {
    configurable: true,
    value: {
      registerTool: (tool: RegisteredTool, options?: { signal?: AbortSignal }) => {
        tools.push(tool);
        signals.push(options?.signal);
      },
    },
  });

  return { tools, signals };
}

function tool(overrides: Partial<AgentTool> = {}): AgentTool {
  return {
    name: 'demo_tool',
    title: 'Demo',
    description: 'A demo tool',
    execute: async (input) => ({ content: [{ type: 'text', text: JSON.stringify(input) }] }),
    ...overrides,
  };
}

afterEach(() => {
  for (const target of [document, navigator] as const) {
    Reflect.deleteProperty(target as unknown as Record<string, unknown>, 'modelContext');
  }
  vi.restoreAllMocks();
});

describe('getModelContext', () => {
  it('returns undefined when the browser exposes no WebMCP API', () => {
    expect(getModelContext()).toBeUndefined();
  });

  it('finds the API on navigator, where Chrome 149 ships it', () => {
    installModelContext('navigator');

    expect(getModelContext()).toBeDefined();
  });

  it('prefers document, which is where the specification and Chrome 153 put it', async () => {
    installModelContext('navigator');
    const fromDocument = installModelContext('document');

    await registerAgentTools([tool()], new AbortController().signal);

    expect(fromDocument.tools).toHaveLength(1);
  });
});

describe('registerTools', () => {
  it('reports that the browser has no support rather than throwing', async () => {
    const result = await registerAgentTools([tool()], new AbortController().signal);

    expect(result).toEqual([]);
  });

  it('registers every tool and passes the abort signal that unregisters them', async () => {
    const host = installModelContext('document');
    const controller = new AbortController();

    const result = await registerAgentTools(
      [tool({ name: 'a' }), tool({ name: 'b' })],
      controller.signal,
    );

    expect(result).toEqual(['a', 'b']);
    expect(host.signals).toEqual([controller.signal, controller.signal]);
  });

  it('stops registering once the signal is aborted', async () => {
    const host = installModelContext('document');
    const controller = new AbortController();
    controller.abort();

    const result = await registerAgentTools([tool()], controller.signal);

    expect(result).toEqual([]);
    expect(host.tools).toHaveLength(0);
  });

  it('keeps going when one tool fails to register', async () => {
    const registered: string[] = [];
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: {
        registerTool: (candidate: { name: string }) => {
          if (candidate.name === 'bad') throw new Error('rejected by the browser');
          registered.push(candidate.name);
        },
      },
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await registerAgentTools(
      [tool({ name: 'bad' }), tool({ name: 'good' })],
      new AbortController().signal,
    );

    expect(result).toEqual(['good']);
    expect(registered).toEqual(['good']);
  });
});

describe('telemetry', () => {
  it('reports how many tools registered and the outcome of each call', async () => {
    const host = installModelContext('document');
    const registered: number[] = [];
    const calls: Array<[string, string]> = [];
    const telemetry: AgentToolsTelemetry = {
      registered: (count) => registered.push(count),
      called: (name, outcome) => calls.push([name, outcome]),
    };

    await registerAgentTools(
      [
        tool({ name: 'ok' }),
        tool({
          name: 'rejects',
          execute: async () => ({ content: [{ type: 'text', text: 'no' }], isError: true }),
        }),
        tool({
          name: 'throws',
          execute: async () => {
            throw new Error('boom');
          },
        }),
      ],
      new AbortController().signal,
      telemetry,
    );

    expect(registered).toEqual([3]);

    for (const entry of host.tools) await entry.execute({});

    expect(calls).toEqual([
      ['ok', 'answered'],
      ['rejects', 'rejected'],
      ['throws', 'failed'],
    ]);
  });

  it('reports nothing when the browser has no WebMCP', async () => {
    const calls: number[] = [];

    await registerAgentTools([tool()], new AbortController().signal, {
      registered: (count) => calls.push(count),
      called: () => {},
    });

    expect(calls).toEqual([]);
  });
});

describe('the execute wrapper', () => {
  it('hands the tool a parsed object when the browser passes JSON text', async () => {
    const host = installModelContext('document');
    await registerAgentTools([tool()], new AbortController().signal);

    const result = await host.tools[0]?.execute('{"query":"invoices"}');

    expect(result?.content[0]?.text).toBe('{"query":"invoices"}');
  });

  it.each(['not json', '[1,2]', 42])('substitutes an empty input for %s', async (input) => {
    const host = installModelContext('document');
    await registerAgentTools([tool()], new AbortController().signal);

    const result = await host.tools[0]?.execute(input);

    expect(result?.content[0]?.text).toBe('{}');
  });

  it('turns a thrown error into an error result instead of a rejection', async () => {
    const host = installModelContext('document');
    await registerAgentTools(
      [
        tool({
          name: 'explodes',
          execute: async () => {
            throw new Error('network down');
          },
        }),
      ],
      new AbortController().signal,
    );

    const result = await host.tools[0]?.execute({});

    expect(result?.isError).toBe(true);
    expect(result?.content[0]?.text).toContain('network down');
  });
});
