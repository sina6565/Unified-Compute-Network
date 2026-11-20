# Provider status and validation

The adapters below are implemented but disabled by default. Free access is not guaranteed: quotas, model availability, account eligibility, and commercial terms must be checked per account and model.

| Provider | Adapter | Capability | Free-tier status |
|---|---|---|---|
| Groq | Implemented | Chat; vision only on supported models | Model/account limits |
| Gemini | Implemented | Chat + image understanding | Model/region/account limits |
| Pollinations | Implemented opt-in | Image generation | Public endpoint is not guaranteed |
| OpenRouter | Implemented | Chat + vision on compatible models | Dynamic `:free` models; rate-limited |
| Mistral | Implemented | Chat + vision on compatible models | Account/plan dependent |
| Cerebras | Implemented | Chat | Account/model dependent |
| SambaNova | Implemented | Chat; vision on compatible models | Account/model dependent |
| NVIDIA NIM | Implemented | Chat + vision on compatible models | Credit/plan dependent; not guaranteed free |
| Ollama Local | Implemented | Chat + vision if local model supports it | No hosted API fee; local compute required |
| Ollama Cloud | Implemented | Chat + vision if selected model supports it | Account/quota dependent |
| OpenRouter Image API | Implemented opt-in | Image generation | Paid unless a current $0 endpoint is verified |

OpenCode and OpenCode Zen are deferred by owner instruction.

## Modality semantics
- Vision sends an existing image to a chat model and receives text. The model must list image input support.
- Image generation creates a new image. It is a separate adapter and endpoint.
- Gemini accepts base64 image data URLs in this adapter. Remote URLs must first pass through a trusted upload/fetch flow; arbitrary URLs are not fetched by the adapter.
- OpenRouter's current free-model list changes dynamically. Use `openrouter/free` for chat routing or pin a current model ID ending in `:free`; check input modalities before sending images.
- Image generation through OpenRouter is not assumed free. Pollinations remains opt-in and its public availability/terms must be checked.

## Activation checklist
1. Verify current official API docs, model ID, and modality support.
2. Verify quota, rate limits, region/account restrictions, and whether the account has free entitlement.
3. Verify terms for commercial use and serving third-party users.
4. Keep credentials in runtime secrets, never in source control.
5. Add timeout, retry/backoff, request-size limits, observability, and cost controls before production exposure.
6. Run contract tests with authorized credentials; no live provider test has been performed by this change.
