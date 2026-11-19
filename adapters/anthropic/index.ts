import { AdapterConfigurationError, requireEnv, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

export class AnthropicAdapter implements ProviderAdapter {
  readonly id = "anthropic";
  readonly capabilities = ["chat"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const apiKey = requireEnv("ANTHROPIC_API_KEY");
    const model = request.model?.trim() || process.env.ANTHROPIC_MODEL?.trim();
    if (!model) throw new AdapterConfigurationError("Set request.model or ANTHROPIC_MODEL to a supported model ID");
    const messages = request.messages ?? [];
    const system = messages.filter(message => message.role === "system").map(message => message.content).join("\n");
    const conversation = messages.filter(message => message.role !== "system");
    if (!conversation.length) throw new AdapterConfigurationError("Anthropic chat requires at least one user or assistant message");

    const baseUrl = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com/v1").replace(/\/$/, "");
    return fetch(`${baseUrl}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        accept: request.stream ? "text/event-stream" : "application/json"
      },
      body: JSON.stringify({
        model,
        max_tokens: request.max_tokens ?? 1024,
        messages: conversation,
        ...(system ? { system } : {}),
        ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
        stream: request.stream ?? false
      }),
      signal: request.signal
    });
  }
}
