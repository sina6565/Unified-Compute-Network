import type { ProviderAdapter, NormalizedRequest } from "../shared/base-adapter.js";
import { forwardOpenAICompatible } from "../shared/openai-compatible.js";

export class HuggingFaceAdapter implements ProviderAdapter {
  readonly id = "huggingface";
  readonly capabilities = ["chat"] as const;

  forward(request: NormalizedRequest): Promise<Response> {
    return forwardOpenAICompatible({
      apiKeyEnv: "HF_TOKEN",
      modelEnv: "HF_MODEL",
      baseUrlEnv: "HF_BASE_URL",
      defaultBaseUrl: "https://router.huggingface.co/v1",
      request
    });
  }
}
