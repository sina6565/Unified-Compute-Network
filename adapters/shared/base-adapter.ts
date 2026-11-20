export type Capability = "chat" | "vision" | "image" | "audio" | "video" | "embeddings";

export type NormalizedContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail?: "auto" | "low" | "high" } };

export interface NormalizedMessage {
  role: "system" | "user" | "assistant";
  content: string | NormalizedContentPart[];
}

export interface NormalizedRequest {
  model?: string;
  messages?: NormalizedMessage[];
  prompt?: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

export interface ProviderAdapter {
  readonly id: string;
  readonly capabilities: readonly Capability[];
  forward(request: NormalizedRequest): Promise<Response>;
}

export class AdapterConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdapterConfigurationError";
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new AdapterConfigurationError(`Missing required environment variable: ${name}`);
  return value;
}

export function lastUserPrompt(request: NormalizedRequest): string {
  const fromPrompt = request.prompt?.trim();
  if (fromPrompt) return fromPrompt;
  const lastUser = [...(request.messages ?? [])].reverse().find((message) => message.role === "user");
  if (typeof lastUser?.content === "string" && lastUser.content.trim()) return lastUser.content;
  const text = Array.isArray(lastUser?.content)
    ? lastUser.content.filter((part) => part.type === "text").map((part) => part.text).join("\n").trim()
    : "";
  if (!text) throw new AdapterConfigurationError("A non-empty prompt or user text part is required");
  return text;
}
