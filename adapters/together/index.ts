import type { ProviderAdapter, NormalizedRequest } from "../shared/base-adapter.js";
import { forwardOpenAICompatible } from "../shared/openai-compatible.js";

export class TogetherAdapter implements ProviderAdapter {
  readonly id = "together";
  readonly capabilities = ["chat"] as const;

  forward(request: NormalizedRequest): Promise<Response> {
    return forwardOpenAICompatible({
      apiKeyEnv: "TOGETHER_API_KEY",
      modelEnv: "TOGETHER_MODEL",
      baseUrlEnv: "TOGETHER_BASE_URL",
      defaultBaseUrl: "https://api.together.xyz/v1",
      request
    });
  }
}
