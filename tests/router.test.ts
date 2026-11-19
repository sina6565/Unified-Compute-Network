import test from "node:test";
import assert from "node:assert/strict";
import type { ProviderAdapter } from "../adapters/shared/base-adapter.js";
import { ProviderRegistry } from "../core/gateway/src/provider-registry.js";
import { ProviderRouter, ProviderSelectionError } from "../core/gateway/src/router.js";

const fake = (id: string): ProviderAdapter => ({
  id,
  capabilities: ["chat"],
  async forward() { return new Response(JSON.stringify({ provider: id }), { status: 200 }); }
});

test("router requires explicit selection when multiple providers are available", async () => {
  const registry = new ProviderRegistry();
  registry.register(fake("one"));
  registry.register(fake("two"));
  const router = new ProviderRouter(registry);
  await assert.rejects(() => router.forward({ messages: [{ role: "user", content: "hello" }] }),
    (error: unknown) => error instanceof ProviderSelectionError && error.availableProviders.length === 2);
});

test("router honors an explicit provider selection", async () => {
  const registry = new ProviderRegistry();
  registry.register(fake("one"));
  registry.register(fake("two"));
  const response = await new ProviderRouter(registry).forward(
    { messages: [{ role: "user", content: "hello" }] }, "two");
  assert.deepEqual(await response.json(), { provider: "two" });
});
