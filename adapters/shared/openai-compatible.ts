import { AdapterConfigurationError, requireEnv, type NormalizedRequest } from "./base-adapter.js";

export interface OpenAICompatibleConfig {
  apiKeyEnv: string;
  modelEnv: string;
  baseUrlEnv: string;
  defaultBaseUrl: string;
  request: NormalizedRequest;
  extraHeaders?: Record<string, string>;
}

export function forwardOpenAICompatible(config: OpenAICompatibleConfig): Promise<Response> {
  const apiKey = requireEnv(config.apiKeyEnv);
  const model = config.request.model?.trim() || process.env[config.modelEnv]?.trim();
  if (!model) throw new AdapterConfigurationError(`Set request.model or ${config.modelEnv} to a supported model ID`);
  if (!config.request.messages?.length) throw new AdapterConfigurationError("Chat request requires at least one message");

  const baseUrl = (process.env[config.baseUrlEnv] || config.defaultBaseUrl).replace(/\/$/, "");
  return fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      accept: config.request.stream ? "text/event-stream" : "application/json",
      ...config.extraHeaders
    },
    body: JSON.stringify({
      model,
      messages: config.request.messages,
      stream: config.request.stream ?? false,
      ...(config.request.max_tokens !== undefined ? { max_tokens: config.request.max_tokens } : {}),
      ...(config.request.temperature !== undefined ? { temperature: config.request.temperature } : {})
    }),
    signal: config.request.signal
  });
}
