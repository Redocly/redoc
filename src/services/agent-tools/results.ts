import type { AgentToolResult } from './types.js';

/** Longest text one tool result may carry. */
export const MAX_AGENT_RESULT_CHARS = 24_000;

export function agentTextResult(text: string): AgentToolResult {
  const trimmed =
    text.length > MAX_AGENT_RESULT_CHARS
      ? `${text.slice(0, MAX_AGENT_RESULT_CHARS)}\n\n[truncated: the full text is longer than ${MAX_AGENT_RESULT_CHARS} characters]`
      : text;

  return { content: [{ type: 'text', text: trimmed }] };
}

export function agentJsonResult(value: unknown): AgentToolResult {
  return agentTextResult(JSON.stringify(value, null, 2));
}

export function agentErrorResult(message: string): AgentToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}
