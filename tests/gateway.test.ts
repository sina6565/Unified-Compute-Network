import test from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../core/gateway/src/server.js";

test("gateway exposes health and protects API routes", async () => {
  const previous = process.env.UCN_API_KEY;
  process.env.UCN_API_KEY = "test-secret";
  const app = buildServer();
  try {
    const health = await app.inject({ method: "GET", url: "/health" });
    assert.equal(health.statusCode, 200);

    const unauthorized = await app.inject({ method: "GET", url: "/v1/providers" });
    assert.equal(unauthorized.statusCode, 401);

    const authorized = await app.inject({
      method: "GET",
      url: "/v1/providers",
      headers: { authorization: "Bearer test-secret" }
    });
    assert.equal(authorized.statusCode, 200);
    assert.deepEqual(authorized.json(), { data: [] });
  } finally {
    await app.close();
    if (previous === undefined) delete process.env.UCN_API_KEY;
    else process.env.UCN_API_KEY = previous;
  }
});

test("gateway rejects malformed chat requests", async () => {
  const previous = process.env.UCN_API_KEY;
  process.env.UCN_API_KEY = "test-secret";
  const app = buildServer();
  try {
    const response = await app.inject({
      method: "POST",
      url: "/v1/chat/completions",
      headers: { authorization: "Bearer test-secret" },
      payload: { messages: [] }
    });
    assert.equal(response.statusCode, 400);
  } finally {
    await app.close();
    if (previous === undefined) delete process.env.UCN_API_KEY;
    else process.env.UCN_API_KEY = previous;
  }
});
