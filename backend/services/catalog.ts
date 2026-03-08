import { shopifyProvider } from './providers/shopify.js';
import { amazonProvider } from './providers/amazon.js';
import { CatalogProvider, CatalogSearchResult } from '../types.js';

const providers: Record<string, CatalogProvider> = {
  shopify: shopifyProvider,
  amazon: amazonProvider,
};

export function normalizeProductSource(source: string | undefined): string {
  if (source === 'amazon') return 'amazon';
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
