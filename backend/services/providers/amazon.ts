import { CatalogProvider, CatalogSearchResult } from '../../types.js';

export const amazonProvider: CatalogProvider = {
  async search(query: string, _limit: number): Promise<CatalogSearchResult> {
    console.warn('[Amazon] Provider not yet implemented');
    return { query, products: [] };
  },
};
