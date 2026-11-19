export type Capability = "chat" | "vision" | "image" | "audio" | "video" | "embeddings";

export interface NormalizedMessage {
  role: "system" | "user" | "assistant";
  content: string;
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
  if (!lastUser?.content?.trim()) {
    throw new AdapterConfigurationError("A non-empty prompt or user message is required");
  }
  return lastUser.content;
}
