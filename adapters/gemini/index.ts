import { AdapterConfigurationError, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

export class GeminiAdapter implements ProviderAdapter {
  readonly id = "gemini";
  readonly capabilities = ["chat", "vision"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new AdapterConfigurationError("Missing required environment variable: GEMINI_API_KEY");
    const model = request.model?.trim() || process.env.GEMINI_MODEL?.trim();
    if (!model) throw new AdapterConfigurationError("Set request.model or GEMINI_MODEL");
    const messages = request.messages ?? [];
    const contents: Array<{ role: "user" | "model"; parts: GeminiPart[] }> = [];
    for (const message of messages.filter((item) => item.role !== "system")) {
      const parts: GeminiPart[] = typeof message.content === "string" ? [{ text: message.content }] : message.content.map((part): GeminiPart => {
        if (part.type === "text") return { text: part.text };
        const match = part.image_url.url.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
        if (!match) throw new AdapterConfigurationError("Gemini vision requires an image data URL; upload remote images through a trusted server-side file flow first");
        return { inlineData: { mimeType: match[1], data: match[2] } };
      });
      contents.push({ role: message.role === "assistant" ? "model" : "user", parts });
    }
    if (!contents.length && request.prompt?.trim()) contents.push({ role: "user", parts: [{ text: request.prompt.trim() }] });
    if (!contents.length) throw new AdapterConfigurationError("Gemini requires at least one user message");
    const system = messages.find((item) => item.role === "system");
    const systemText = system ? (typeof system.content === "string" ? system.content : system.content.filter((p) => p.type === "text").map((p) => p.text).join("\n")) : "";
    const body = {
      contents,
      ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
      ...(request.temperature !== undefined || request.max_tokens !== undefined ? { generationConfig: {
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
