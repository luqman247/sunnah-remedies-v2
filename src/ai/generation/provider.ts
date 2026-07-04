/**
 * Provider-Abstracted LLM Interface.
 *
 * Generation is provider-abstracted (§4, §17 AC9).
 * Swap providers without touching surfaces.
 */

import Anthropic from "@anthropic-ai/sdk";
import { AI_CONFIG } from "../config";

/* ── Abstract Interface ──────────────────────────────────────────── */

export interface GenerationRequest {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: "json" | "text";
}

export interface GenerationResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  stopReason: string;
}

export interface GenerationProvider {
  generate(request: GenerationRequest): Promise<GenerationResponse>;
  generateStream(
    request: GenerationRequest
  ): AsyncIterable<string>;
}

/* ── Anthropic Implementation ────────────────────────────────────── */

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");
  return new Anthropic({ apiKey });
}

export const anthropicProvider: GenerationProvider = {
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: AI_CONFIG.generation.model,
      max_tokens: request.maxTokens ?? AI_CONFIG.generation.maxTokens,
      temperature: request.temperature ?? AI_CONFIG.generation.temperature,
      system: request.systemPrompt,
      messages: [{ role: "user", content: request.userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return {
      content: textBlock?.text ?? "",
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      stopReason: response.stop_reason ?? "unknown",
    };
  },

  async *generateStream(request: GenerationRequest): AsyncIterable<string> {
    const client = getAnthropicClient();
    const stream = client.messages.stream({
      model: AI_CONFIG.generation.model,
      max_tokens: request.maxTokens ?? AI_CONFIG.generation.maxTokens,
      temperature: request.temperature ?? AI_CONFIG.generation.temperature,
      system: request.systemPrompt,
      messages: [{ role: "user", content: request.userMessage }],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  },
};

/* ── Provider Registry ───────────────────────────────────────────── */

const providers: Record<string, GenerationProvider> = {
  anthropic: anthropicProvider,
};

export function getGenerationProvider(
  name?: string
): GenerationProvider {
  const key = name ?? AI_CONFIG.generation.provider;
  const provider = providers[key];
  if (!provider) throw new Error(`Unknown generation provider: ${key}`);
  return provider;
}
