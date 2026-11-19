# Unified Compute Network (UCN)

Provider-neutral compute routing and settlement research project.

## Current scope

This repository is an independent project. It is not part of SINA AI STUDIO and must not be coupled to that product's runtime or release process.

The first implementation slice establishes:
- a small provider-neutral adapter contract;
- opt-in Groq chat and Gemini generate-content adapters;
- a Pollinations image adapter behind explicit configuration;
- a provider registry catalog that distinguishes implementation status from pricing, quota, and commercial-use verification.

## Important operating rules

1. Never assume a provider's free tier is unlimited, stable, or commercially sublicensable.
2. Do not emulate official clients, spoof TLS fingerprints, or bypass upstream access controls.
3. Credentials are read from environment variables and must never be committed.
4. Providers are opt-in. Missing credentials or disabled providers must fail clearly, not silently route to a paid service.
5. Provider model IDs and endpoints are configuration, not permanent constants.
6. A modality listed in the catalog is not proof that the adapter implements that modality.

## Development

Requires Node.js 22+ and pnpm 9+.

```bash
pnpm install
pnpm test
pnpm typecheck
```

See [provider status and validation](docs/PROVIDER_STATUS.md) and [architecture](docs/ARCHITECTURE.md).
