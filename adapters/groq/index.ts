import { AdapterConfigurationError, requireEnv, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";

export class GroqAdapter implements ProviderAdapter {
  readonly id = "groq";
  readonly capabilities = ["chat", "vision"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const apiKey = requireEnv("GROQ_API_KEY");
    const model = request.model?.trim() || process.env.GROQ_MODEL?.trim();
    if (!model) throw new AdapterConfigurationError("Set request.model or GROQ_MODEL to a currently supported Groq model");
    if (!request.messages?.length) throw new AdapterConfigurationError("Groq chat requires messages");

    const baseUrl = (process.env.GROQ_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
    return fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        accept: request.stream ? "text/event-stream" : "application/json"
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        stream: request.stream ?? false,
        ...(request.max_tokens !== undefined ? { max_tokens: request.max_tokens } : {}),
        ...(request.temperature !== undefined ? { temperature: request.temperature } : {})
      }),
      signal: request.signal
    });
  }
}
