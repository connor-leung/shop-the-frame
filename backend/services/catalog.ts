import { shopifyProvider } from './providers/shopify.js';
// TODO: Implement Amazon provider — import { amazonProvider } from './providers/amazon.js';
import { CatalogProvider, CatalogSearchResult } from '../types.js';

const providers: Record<string, CatalogProvider> = {
  shopify: shopifyProvider,
  // TODO: Register Amazon provider once implemented
  // amazon: amazonProvider,
};

export function normalizeProductSource(source: string | undefined): string {
  // TODO: Add 'amazon' once amazonProvider is implemented
  return 'shopify';
}

export async function searchCatalog(
  query: string,
  limit = 5,
  source = 'shopify',
): Promise<CatalogSearchResult> {
  const key = normalizeProductSource(source);
  const provider = providers[key] ?? providers.shopify;
  return provider.search(query, limit);
}
