import Fastify, { type FastifyInstance } from "fastify";
import { timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";
import type { NormalizedRequest } from "../../../adapters/shared/base-adapter.js";
import { createConfiguredRegistry } from "./provider-registry.js";
import { ProviderRouter, ProviderSelectionError } from "./router.js";

interface ChatBody extends NormalizedRequest {
  provider?: string;
}

function isAuthorized(header: string | undefined, expected: string): boolean {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function buildServer(): FastifyInstance {
  const apiKey = process.env.UCN_API_KEY?.trim();
  if (!apiKey) throw new Error("UCN_API_KEY is required; refusing to start an unauthenticated gateway");

  const registry = createConfiguredRegistry();
  const router = new ProviderRouter(registry);
  const app = Fastify({ logger: true, bodyLimit: 1024 * 1024 });

  app.get("/health", async () => ({ status: "ok", service: "ucn-gateway" }));

  app.addHook("onRequest", async (request, reply) => {
    if (!isAuthorized(request.headers.authorization, apiKey)) {
      return reply.code(401).send({ error: { message: "Unauthorized", type: "authentication_error" } });
    }
  });

  app.get("/v1/providers", async () => ({ data: registry.list() }));

  app.post<{ Body: ChatBody }>("/v1/chat/completions", async (request, reply) => {
    const body = request.body;
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return reply.code(400).send({ error: { message: "messages must be a non-empty array", type: "invalid_request_error" } });
    }
    if (body.stream && body.stream !== false) {
      return reply.code(501).send({ error: { message: "Streaming passthrough is not enabled in this gateway release", type: "not_implemented" } });
    }

    try {
      const upstream = await router.forward({
        model: body.model,
        messages: body.messages,
        stream: false,
        max_tokens: body.max_tokens,
        temperature: body.temperature
      }, body.provider);
      const contentType = upstream.headers.get("content-type") || "application/json";
      const payload = Buffer.from(await upstream.arrayBuffer());
      return reply.code(upstream.status).header("content-type", contentType).send(payload);
    } catch (error) {
      if (error instanceof ProviderSelectionError) {
        return reply.code(error.availableProviders.length ? 409 : 503).send({
          error: { message: error.message, type: "provider_selection_error" },
          available_providers: error.availableProviders
        });
      }
      request.log.error({ err: error }, "Provider request failed");
      return reply.code(502).send({ error: { message: "Upstream provider request failed", type: "upstream_error" } });
    }
  });

  return app;
}
