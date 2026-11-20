import { OpenAICompatibleAdapter } from "./index.js";

export const compatibleProviders = {
  mistral: new OpenAICompatibleAdapter({ id: "mistral", baseUrl: "https://api.mistral.ai/v1", apiKeyEnv: "MISTRAL_API_KEY", modelEnv: "MISTRAL_MODEL" }),
  cerebras: new OpenAICompatibleAdapter({ id: "cerebras", baseUrl: "https://api.cerebras.ai/v1", apiKeyEnv: "CEREBRAS_API_KEY", modelEnv: "CEREBRAS_MODEL" }),
  sambanova: new OpenAICompatibleAdapter({ id: "sambanova", baseUrl: "https://api.sambanova.ai/v1", apiKeyEnv: "SAMBANOVA_API_KEY", modelEnv: "SAMBANOVA_MODEL" }),
  nvidiaNim: new OpenAICompatibleAdapter({ id: "nvidia-nim", baseUrl: "https://integrate.api.nvidia.com/v1", apiKeyEnv: "NVIDIA_API_KEY", modelEnv: "NVIDIA_NIM_MODEL" }),
  openrouter: new OpenAICompatibleAdapter({ id: "openrouter", baseUrl: "https://openrouter.ai/api/v1", apiKeyEnv: "OPENROUTER_API_KEY", modelEnv: "OPENROUTER_MODEL" }),
  ollamaLocal: new OpenAICompatibleAdapter({ id: "ollama-local", baseUrl: "http://127.0.0.1:11434/v1", modelEnv: "OLLAMA_LOCAL_MODEL", allowNoKey: true }),
  ollamaCloud: new OpenAICompatibleAdapter({ id: "ollama-cloud", baseUrl: "https://ollama.com/v1", apiKeyEnv: "OLLAMA_API_KEY", modelEnv: "OLLAMA_CLOUD_MODEL" })
} as const;
