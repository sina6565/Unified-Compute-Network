import { AdapterConfigurationError, lastUserPrompt, type NormalizedRequest, type ProviderAdapter } from "../shared/base-adapter.js";

export class PollinationsImageAdapter implements ProviderAdapter {
  readonly id = "pollinations-image";
  readonly capabilities = ["image"] as const;

  async forward(request: NormalizedRequest): Promise<Response> {
    if (process.env.POLLINATIONS_ENABLED !== "true") {
      throw new AdapterConfigurationError("Pollinations adapter is disabled; set POLLINATIONS_ENABLED=true only after reviewing current service terms and limits");
    }

    const prompt = lastUserPrompt(request);
    const baseUrl = (process.env.POLLINATIONS_IMAGE_BASE_URL || "https://image.pollinations.ai/prompt").replace(/\/$/, "");
    const url = new URL(`${baseUrl}/${encodeURIComponent(prompt)}`);
    const model = request.model || process.env.POLLINATIONS_IMAGE_MODEL;
    if (model) url.searchParams.set("model", model);
    url.searchParams.set("nologo", "true");

    return fetch(url, {
      method: "GET",
      headers: { accept: "image/*" },
      signal: request.signal
    });
  }
}
