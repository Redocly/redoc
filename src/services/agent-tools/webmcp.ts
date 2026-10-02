import { agentErrorResult } from './results.js';

import type { AgentTool, AgentToolOutcome, AgentToolResult, AgentToolsTelemetry } from './types.js';

type ModelContextLike = {
  registerTool: (
    tool: Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
};

type ModelContextHost = { modelContext?: Partial<ModelContextLike> };

/** The browser's WebMCP entry point: `document.modelContext`, then `navigator.modelContext`. */
export function getModelContext(): ModelContextLike | undefined {
  if (typeof document === 'undefined') return undefined;

  const host =
    (document as unknown as ModelContextHost).modelContext ??
    (navigator as unknown as ModelContextHost).modelContext;

  return typeof host?.registerTool === 'function' ? (host as ModelContextLike) : undefined;
}

/**
 * Registers every tool with the browser; aborting the shared signal unregisters them all.
 * Returns the names that registered; none when the browser has no WebMCP.
 */
export async function registerAgentTools(
  tools: AgentTool[],
  signal: AbortSignal,
  telemetry?: AgentToolsTelemetry,
): Promise<string[]> {
  const modelContext = getModelContext();
  if (!modelContext) return [];

  const registered: string[] = [];

  for (const tool of tools) {
    if (signal.aborted) break;

    try {
      await modelContext.registerTool(
        {
          name: tool.name,
          title: tool.title,
          description: tool.description,
          ...(tool.inputSchema ? { inputSchema: tool.inputSchema } : {}),
          ...(tool.annotations ? { annotations: tool.annotations } : {}),
          execute: (input: unknown, options?: { signal?: AbortSignal }) =>
            runTool(tool, input, options, telemetry),
        },
        { signal },
      );
      registered.push(tool.name);
    } catch (error) {
      console.warn(`WebMCP: failed to register the "${tool.name}" tool`, error);
    }
  }

  if (registered.length) telemetry?.registered(registered.length);

  return registered;
}

/** A thrown tool becomes an error result, which is what an agent can act on. */
async function runTool(
  tool: AgentTool,
  input: unknown,
  options?: { signal?: AbortSignal },
  telemetry?: AgentToolsTelemetry,
): Promise<AgentToolResult> {
  let outcome: AgentToolOutcome = 'answered';

  try {
    const result = await tool.execute(toInputObject(input), options);
    if (result.isError) outcome = 'rejected';
    return result;
  } catch (error) {
    outcome = 'failed';
    const message = error instanceof Error ? error.message : String(error);
    return agentErrorResult(`The "${tool.name}" tool failed: ${message}`);
  } finally {
    telemetry?.called(tool.name, outcome);
  }
}

/** Chrome passes the arguments as a JSON string. */
function toInputObject(input: unknown): Record<string, unknown> {
  const parsed: unknown = typeof input === 'string' ? tryParseJson(input) : input;

  return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
