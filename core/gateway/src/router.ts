import type { NormalizedRequest, ProviderAdapter } from "../../../adapters/shared/base-adapter.js";
import { ProviderRegistry } from "./provider-registry.js";

export class ProviderSelectionError extends Error {
  constructor(message: string, readonly availableProviders: string[]) {
    super(message);
    this.name = "ProviderSelectionError";
  }
}

export class ProviderRouter {
  constructor(private readonly registry: ProviderRegistry) {}

  async forward(request: NormalizedRequest, providerId?: string): Promise<Response> {
    const available = this.registry.list();
    if (providerId) {
      const selected = this.registry.get(providerId);
      if (!selected) throw new ProviderSelectionError(`Provider is not configured: ${providerId}`, available.map(item => item.id));
      return selected.forward(request);
    }
    if (available.length === 0) throw new ProviderSelectionError("No provider is configured", []);
    if (available.length > 1) {
      throw new ProviderSelectionError("Select a provider explicitly; automatic price ranking is not configured", available.map(item => item.id));
    }
    const onlyProvider = this.registry.get(available[0].id) as ProviderAdapter;
    return onlyProvider.forward(request);
  }
}
