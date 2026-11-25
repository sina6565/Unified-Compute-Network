import { AdapterConfigurationError, requireEnv, lastUserPrompt, type NormalizedRequest } from "../shared/base-adapter.js";

export class OpenRouterImageAdapter {
  readonly id = "openrouter-image";
  readonly capabilities = ["image"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    const model = request.model?.trim() || process.env.OPENROUTER_IMAGE_MODEL?.trim();
    if (!model) throw new AdapterConfigurationError("Set request.model or OPENROUTER_IMAGE_MODEL");
    const prompt = lastUserPrompt(request);
    return fetch("https://openrouter.ai/api/v1/images", {
      method: "POST",
      headers: { authorization: `Bearer ${requireEnv("OPENROUTER_API_KEY")}`, "content-type": "application/json" },
      body: JSON.stringify({ model, prompt }),
      signal: request.signal
    });
  }
}
