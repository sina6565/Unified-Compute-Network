import test from "node:test";
import assert from "node:assert/strict";
import { OpenAICompatibleAdapter } from "../adapters/openai-compatible/index.js";
import { compatibleProviders } from "../adapters/openai-compatible/providers.js";
import { OpenRouterImageAdapter } from "../adapters/openrouter/images.js";

test("free and local provider adapters are registered with stable IDs", () => {
  assert.equal(compatibleProviders.openrouter.id, "openrouter");
  assert.equal(compatibleProviders.mistral.id, "mistral");
  assert.equal(compatibleProviders.cerebras.id, "cerebras");
  assert.equal(compatibleProviders.sambanova.id, "sambanova");
  assert.equal(compatibleProviders.nvidiaNim.id, "nvidia-nim");
  assert.equal(compatibleProviders.ollamaLocal.id, "ollama-local");
  assert.equal(compatibleProviders.ollamaCloud.id, "ollama-cloud");
});

test("compatible adapter accepts multimodal content without altering image parts", async () => {
  const oldKey = process.env.TEST_PROVIDER_KEY;
  process.env.TEST_PROVIDER_KEY = "test";
  const adapter = new OpenAICompatibleAdapter({ id: "test-provider", baseUrl: "https://example.invalid/v1",
    apiKeyEnv: "TEST_PROVIDER_KEY", modelEnv: "TEST_MODEL" });
  const originalFetch = globalThis.fetch;
  let sent: unknown;
  globalThis.fetch = (async (_url, init) => {
    sent = JSON.parse(String(init?.body));
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  try {
    await adapter.forward({ model: "vision-model", messages: [{ role: "user", content: [
      { type: "text", text: "Describe this" },
      { type: "image_url", image_url: { url: "https://example.com/image.png" } }
    ] }] });
    assert.deepEqual((sent as { messages: unknown[] }).messages[0], { role: "user", content: [
      { type: "text", text: "Describe this" },
      { type: "image_url", image_url: { url: "https://example.com/image.png" } }
    ] });
  } finally {
    globalThis.fetch = originalFetch;
    if (oldKey === undefined) delete process.env.TEST_PROVIDER_KEY;
    else process.env.TEST_PROVIDER_KEY = oldKey;
  }
});

test("OpenRouter image generation adapter is separate from vision chat", () => {
  assert.equal(new OpenRouterImageAdapter().id, "openrouter-image");
});
