# UCN Gateway (initial runtime)

## Environment
Set `UCN_API_KEY` and at least one provider credential. Provider adapters are registered only when their credentials are configured; Pollinations additionally requires `POLLINATIONS_ENABLED=true`.

## Run
From the repository root:

```bash
pnpm install
pnpm --filter @ucn/gateway dev
```

The gateway exposes `GET /health`, authenticated `GET /v1/providers`, and authenticated `POST /v1/chat/completions`.

When more than one provider is configured, clients must send a `provider` field. The gateway does not silently choose a paid provider or claim automatic price optimization. Streaming passthrough is not enabled in this initial gateway release.
