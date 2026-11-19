import type { ProviderAdapter, NormalizedRequest } from "../shared/base-adapter.js";
import { forwardOpenAICompatible } from "../shared/openai-compatible.js";

export class OpenRouterAdapter implements ProviderAdapter {
  readonly id = "openrouter";
  readonly capabilities = ["chat"] as const;

  forward(request: NormalizedRequest): Promise<Response> {
    return forwardOpenAICompatible({
      apiKeyEnv: "OPENROUTER_API_KEY",
      modelEnv: "OPENROUTER_MODEL",
      baseUrlEnv: "OPENROUTER_BASE_URL",
      defaultBaseUrl: "https://openrouter.ai/api/v1",
      request,
      extraHeaders: {
        ...(process.env.OPENROUTER_SITE_URL ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL } : {}),
        ...(process.env.OPENROUTER_APP_NAME ? { "X-Title": process.env.OPENROUTER_APP_NAME } : {})
      }
    });
  }
}
