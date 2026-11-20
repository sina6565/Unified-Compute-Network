# Free and local model catalog

Model IDs and free quotas change frequently. This catalog was checked on 2026-11-20; refresh it against live provider catalogs before every release. Free access is rate-limited and subject to account/region eligibility.

## Chat and image understanding
- OpenRouter dynamic free chat: `openrouter/free`.
- OpenRouter vision: `nvidia/nemotron-3.5-super-vl:free`, `google/gemma-4-26b-a4b:free`, `google/gemma-4-31b:free`, `inclusionai/ling-3.2-flash:free`.
- Groq, Mistral, Cerebras, SambaNova, NVIDIA NIM, Ollama Local, and Ollama Cloud have adapters. Choose model IDs from each provider's current catalog; hosted free entitlement varies by model/account. Vision only works when the selected model supports image input.
- Ollama Local has no hosted inference charge, but requires local compute and the model's own license must be respected.

## Image generation
- OpenRouter: `recraft/recraft-v4.1-flash-v2:free` is currently listed as zero-price image generation, rate-limited, generation-only, and scheduled to be removed on 2026-11-28. Treat this as temporary and re-check before use.
- Pollinations remains an optional image-generation adapter. Its public endpoint availability, quotas, and terms are not guaranteed.
- Never silently route a free request to a paid image model. If a free model is unavailable, return a clear provider-unavailable result.

## Image understanding vs image generation
Vision sends an existing image to a chat model and receives text. Image generation creates a new image from a prompt. They are separate capabilities and use separate API contracts. Gemini currently accepts base64 image data URLs; arbitrary remote URLs are not fetched by the Gemini adapter.
