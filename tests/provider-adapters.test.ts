import test from "node:test";
import assert from "node:assert/strict";
import { OpenRouterAdapter } from "../adapters/openrouter/index.js";
import { TogetherAdapter } from "../adapters/together/index.js";
import { HuggingFaceAdapter } from "../adapters/huggingface/index.js";
import { AnthropicAdapter } from "../adapters/anthropic/index.js";

test("additional provider adapters expose only implemented chat capability", () => {
  for (const [adapter, id] of [
    [new OpenRouterAdapter(), "openrouter"],
    [new TogetherAdapter(), "together"],
    [new HuggingFaceAdapter(), "huggingface"],
    [new AnthropicAdapter(), "anthropic"]
  ] as const) {
    assert.equal(adapter.id, id);
    assert.deepEqual(adapter.capabilities, ["chat"]);
  }
});
