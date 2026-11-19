import { AdapterConfigurationError, requireEnv, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const MODEL_ALIASES: Record<string, string> = {
  auto: "llama-3.3-70b-versatile",
  fast: "llama-3.3-70b-versatile",
  cheap: "llama-3.1-8b-instant"
};

export function resolveGroqModel(model?: string): string {
  const requested = model?.trim() || process.env.GROQ_MODEL?.trim() || "auto";
  if (requested === "auto" || requested === "fast" || requested === "cheap") {
    const envKey = `GROQ_MODEL_${requested.toUpperCase()}`;
    return process.env[envKey]?.trim() || MODEL_ALIASES[requested];
  }
  return requested;
}

export class GroqAdapter implements ProviderAdapter {
  readonly id = "groq";
  readonly capabilities = ["chat"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const apiKey = requireEnv("GROQ_API_KEY");
    const model = resolveGroqModel(request.model);
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
