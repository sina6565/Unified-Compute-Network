import { AdapterConfigurationError, requireEnv, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

export interface CompatibleProviderConfig {
  id: string;
  baseUrl: string;
  apiKeyEnv?: string;
  modelEnv: string;
  visionModelEnv?: string;
  baseUrlEnv?: string;
  capabilities?: readonly ("chat" | "vision")[];
  allowNoKey?: boolean;
}

export class OpenAICompatibleAdapter implements ProviderAdapter {
  readonly id: string;
  readonly capabilities: readonly ("chat" | "vision")[];
  constructor(private readonly config: CompatibleProviderConfig) {
    this.id = config.id;
    this.capabilities = config.capabilities ?? ["chat", "vision"];
  }

  async forward(request: NormalizedRequest): Promise<Response> {
    const hasImage = request.messages?.some((message) => Array.isArray(message.content) && message.content.some((part) => part.type === "image_url"));
    const configuredModel = hasImage && this.config.visionModelEnv ? process.env[this.config.visionModelEnv] : process.env[this.config.modelEnv];
    const model = request.model?.trim() || configuredModel?.trim();
    if (!model) throw new AdapterConfigurationError(`Set request.model or ${this.config.modelEnv}`);
    if (!request.messages?.length) throw new AdapterConfigurationError("Chat requires messages");
    const apiKey = this.config.apiKeyEnv ? requireEnv(this.config.apiKeyEnv) : "";
    if (!apiKey && !this.config.allowNoKey) throw new AdapterConfigurationError("Provider API key is required");
    return fetch(`${((this.config.baseUrlEnv ? process.env[this.config.baseUrlEnv] : undefined) || this.config.baseUrl).replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}), "content-type": "application/json",
        accept: request.stream ? "text/event-stream" : "application/json" },
      body: JSON.stringify({ model, messages: request.messages, stream: request.stream ?? false,
        ...(request.max_tokens !== undefined ? { max_tokens: request.max_tokens } : {}),
        ...(request.temperature !== undefined ? { temperature: request.temperature } : {}) }),
      signal: request.signal
    });
  }
}
