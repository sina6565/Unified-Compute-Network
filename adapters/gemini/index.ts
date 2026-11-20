import { AdapterConfigurationError, requireEnv, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiAdapter implements ProviderAdapter {
  readonly id = "gemini";
  readonly capabilities = ["chat", "vision"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const apiKey = requireEnv("GEMINI_API_KEY");
    const model = request.model?.trim() || process.env.GEMINI_MODEL?.trim();
    if (!model) throw new AdapterConfigurationError("Set request.model or GEMINI_MODEL");
    const messages = request.messages ?? [];
    const contents = messages.filter((item) => item.role !== "system").map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: typeof item.content === "string" ? [{ text: item.content }] : item.content.map((part) => {
        if (part.type === "text") return { text: part.text };
        const url = part.image_url.url;
        const data = url.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
        return data ? { inlineData: { mimeType: data[1], data: data[2] } } : { fileData: { mimeType: "image/jpeg", fileUri: url } };
      })
    }));
    if (!contents.length && request.prompt?.trim()) contents.push({ role: "user", parts: [{ text: request.prompt.trim() }] });
    if (!contents.length) throw new AdapterConfigurationError("Gemini requires at least one user message");
    const system = messages.find((item) => item.role === "system");
    const body = {
      contents,
      ...(system ? { systemInstruction: { parts: [{ text: typeof system.content === "string" ? system.content : system.content.filter((p) => p.type === "text").map((p) => p.text).join("\n") }] } } : {}),
      ...(request.temperature !== undefined || request.max_tokens !== undefined
        ? { generationConfig: {
            ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
            ...(request.max_tokens !== undefined ? { maxOutputTokens: request.max_tokens } : {})
          } } : {})
    };
    const baseUrl = (process.env.GEMINI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
    return fetch(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body), signal: request.signal
    });
  }
}
