# Free and local model catalog

This is a configurable discovery catalog, not a promise of perpetual free access. Provider quotas, account eligibility, model IDs, and terms change. Verify live provider catalogs before enabling a model for users.

## Chat and vision
- OpenRouter: use a current `:free` model ID. Dynamic fallback: `openrouter/free`. Vision-capable examples from the live catalog include `nvidia/nemotron-3.5-super-vl:free`, `google/gemma-4-26b-a4b:free`, and `inclusionai/ling-3.2-flash:free`.
- Groq: model IDs are account/catalog dependent; configure `GROQ_MODEL`. Vision is model-specific; do not assume every chat model accepts images.
- Mistral: vision-capable model examples include `mistral-small-2506`, `ministral-8b-2512`, and `ministral-14b-2512`; free entitlement depends on account/plan.
- Cerebras: configure `CEREBRAS_MODEL` from its current catalog; availability and free quota are account-specific.
- SambaNova: configure `SAMBANOVA_MODEL` from its current catalog; availability and free quota are account-specific.
- NVIDIA NIM: configure `NVIDIA_NIM_MODEL`; free access is credit/plan dependent, not guaranteed.
- Ollama Local: local models such as `qwen3.5`, `gemma4`, `nemotron-3-nano`, and `llama3.2` require local compute, not a hosted free quota.
- Ollama Cloud: configure `OLLAMA_CLOUD_MODEL`; free GPU-time is subject to current account limits.

## Image generation
- Pollinations adapter remains opt-in; public endpoint availability and terms are not guaranteed.
- OpenRouter Image API is implemented as an optional adapter, but its image-generation models are billed by model and are not classified as free. Do not enable it on a free-only route unless a current zero-price endpoint is verified.

## Image understanding vs image generation
Vision means sending an existing image to a chat model and receiving text. Image generation means creating a new image from a prompt. They are separate capabilities and use separate request/response contracts.
