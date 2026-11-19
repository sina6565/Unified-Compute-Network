import test from "node:test";
import assert from "node:assert/strict";
import { lastUserPrompt, AdapterConfigurationError } from "../adapters/shared/base-adapter.js";
import { GroqAdapter } from "../adapters/groq/index.js";
import { GeminiAdapter } from "../adapters/gemini/index.js";
import { PollinationsImageAdapter } from "../adapters/pollinations/index.js";

test("lastUserPrompt selects the latest user message", () => {
  assert.equal(lastUserPrompt({ messages: [
    { role: "user", content: "first" },
    { role: "assistant", content: "reply" },
    { role: "user", content: "latest" }
  ] }), "latest");
});

test("lastUserPrompt rejects an empty request", () => {
  assert.throws(() => lastUserPrompt({ messages: [] }), AdapterConfigurationError);
});

test("provider adapters expose isolated IDs and capabilities", () => {
  assert.equal(new GroqAdapter().id, "groq");
  assert.deepEqual(new GroqAdapter().capabilities, ["chat"]);
  assert.equal(new GeminiAdapter().id, "gemini");
  assert.deepEqual(new GeminiAdapter().capabilities, ["chat", "vision"]);
  assert.equal(new PollinationsImageAdapter().id, "pollinations-image");
});

test("Pollinations is opt-in by default", async () => {
  const old = process.env.POLLINATIONS_ENABLED;
  delete process.env.POLLINATIONS_ENABLED;
  try {
    await assert.rejects(
      new PollinationsImageAdapter().forward({ prompt: "test image" }),
      AdapterConfigurationError
    );
  } finally {
    if (old === undefined) delete process.env.POLLINATIONS_ENABLED;
    else process.env.POLLINATIONS_ENABLED = old;
  }
});
