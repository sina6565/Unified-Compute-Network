# Architecture

## Adapter boundary

All upstream integrations implement the same small contract in `adapters/shared/base-adapter.ts`. The gateway and future routing engine should depend on this contract, not on provider-specific SDKs.

An adapter:
- declares a stable internal ID and supported capabilities;
- validates its required configuration at request time;
- sends requests only to documented/configured upstream endpoints;
- returns the upstream `Response` so streaming and provider error bodies can be preserved;
- never decides billing, credits, LP accounting, or settlement.

## Runtime policy

The first adapters use standard Node.js `fetch`. A separate Bun service is not required for ordinary documented APIs. Do not add TLS impersonation or client-fingerprint workarounds.

## Planned layers (not implemented yet)

- Core gateway and normalized request validation
- Provider registry and health/capability discovery
- Routing and policy engine
- Pools by capability
- Metering, internal NCU/CC ledger, reconciliation
- AMM/liquidity and governance research

The planned layers above are roadmap items, not working code. No real-money deposits, token issuance, APY, or external settlement are implemented.
