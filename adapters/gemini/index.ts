import { AdapterConfigurationError, lastUserPrompt, requireEnv, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiAdapter implements ProviderAdapter {
  readonly id = "gemini";
  // This first slice sends text prompts only. Vision requires a typed parts/input contract.
  readonly capabilities = ["chat"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const apiKey = requireEnv("GEMINI_API_KEY");
    const model = request.model?.trim() || process.env.GEMINI_MODEL?.trim();
    if (!model) throw new AdapterConfigurationError("Set request.model or GEMINI_MODEL to a currently supported Gemini model");

    const prompt = lastUserPrompt(request);
    const baseUrl = (process.env.GEMINI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
    const body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      ...(request.temperature !== undefined || request.max_tokens !== undefined
        ? { generationConfig: {
            ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
            ...(request.max_tokens !== undefined ? { maxOutputTokens: request.max_tokens } : {})
          } }
        : {})
    };

    return fetch(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body),
      signal: request.signal
    });
  }
}
