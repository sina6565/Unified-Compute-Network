# Provider status and validation

Status is deliberately conservative. Availability, free quotas, model names, and commercial-use rights change frequently and must be verified against current first-party terms before production activation.

| Provider | Adapter in this repository | Initial capability | Pricing/quota status | Commercial-use status |
|---|---|---|---|---|
| Groq | Implemented (opt-in) | Chat completions | Account/model limits must be checked | Verify current terms |
| Google Gemini API | Implemented (opt-in) | Text generation | Free quota varies by model, region, and account | Verify current terms |
| Pollinations | Implemented (opt-in) | Image URL request | Public endpoint availability/limits are not guaranteed | Verify current terms |
| OpenRouter | Catalog only | Planned chat/vision routing | Per-model; some models may be free | Verify model and terms |
| Hugging Face | Catalog only | Planned inference | Provider/model-specific quotas | Verify model and terms |
| Together AI | Catalog only | Planned model APIs | Treat as paid unless current terms prove otherwise | Verify model and terms |
| Anthropic | Catalog only | Planned Messages API adapter | Paid unless current terms prove otherwise | Verify current terms |
| OpenCode Zen | Retired from active UCN plan (user-directed) | None | Do not rely on the claimed public/free endpoint | Not verified |

## Important corrections to the proposal

- A free developer tier does not automatically grant resale, sublicensing, or commercial API aggregation rights.
- Groq model IDs are not hardcoded to potentially retired examples. Configure `GROQ_MODEL` from the current official model catalog.
- Gemini uses its native `generateContent` API shape here; the current adapter accepts text prompts only. It is not falsely represented as an OpenAI-compatible endpoint or as image-capable.
- Pollinations image generation is treated as an external URL response, not an OpenAI image JSON response. Its public availability and terms need separate validation.
- A provider returning HTTP 200 in one manual test does not establish uptime, quota, throughput, or commercial suitability.

## Activation checklist

Before enabling any provider for users:
1. Verify current official API documentation and endpoint.
2. Verify model ID and modality support.
3. Verify quota, rate limits, geographic restrictions, and account requirements.
4. Verify terms for commercial use, redistribution, and serving third-party users.
5. Add timeout, retry/backoff, request-size limits, observability, and cost controls.
6. Run contract tests using an authorized key; do not commit the key.
