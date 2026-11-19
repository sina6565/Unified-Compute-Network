import type { ProviderAdapter } from "../../../adapters/shared/base-adapter.js";
import { GroqAdapter } from "../../../adapters/groq/index.js";
import { GeminiAdapter } from "../../../adapters/gemini/index.js";
import { PollinationsImageAdapter } from "../../../adapters/pollinations/index.js";
import { OpenRouterAdapter } from "../../../adapters/openrouter/index.js";
import { TogetherAdapter } from "../../../adapters/together/index.js";
import { HuggingFaceAdapter } from "../../../adapters/huggingface/index.js";
import { AnthropicAdapter } from "../../../adapters/anthropic/index.js";

export class ProviderRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();

  register(adapter: ProviderAdapter): void {
    if (this.adapters.has(adapter.id)) throw new Error(`Provider already registered: ${adapter.id}`);
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): ProviderAdapter | undefined {
    return this.adapters.get(id);
  }

  list(): Array<{ id: string; capabilities: readonly string[] }> {
    return [...this.adapters.values()].map(({ id, capabilities }) => ({ id, capabilities }));
  }
}

export function createConfiguredRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();
  if (process.env.GROQ_API_KEY) registry.register(new GroqAdapter());
  if (process.env.GEMINI_API_KEY) registry.register(new GeminiAdapter());
  if (process.env.POLLINATIONS_ENABLED === "true") registry.register(new PollinationsImageAdapter());
  if (process.env.OPENROUTER_API_KEY) registry.register(new OpenRouterAdapter());
  if (process.env.TOGETHER_API_KEY) registry.register(new TogetherAdapter());
  if (process.env.HF_TOKEN) registry.register(new HuggingFaceAdapter());
  if (process.env.ANTHROPIC_API_KEY) registry.register(new AnthropicAdapter());
  return registry;
}
