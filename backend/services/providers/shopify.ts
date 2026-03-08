import { searchProducts } from '../catalogClient.js';
import { CatalogProvider, CatalogSearchResult, ProductResult } from '../../types.js';

const HAS_SHOPIFY_CREDS = Boolean(
  process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET,
);

export const shopifyProvider: CatalogProvider = {
  async search(query: string, limit: number): Promise<CatalogSearchResult> {
    if (!HAS_SHOPIFY_CREDS) {
      console.warn('[Shopify] Missing credentials; returning no products');
      return { query, products: [] };
    }

    try {
      const products = await searchProducts(query, limit);

      const transformed: ProductResult[] = products.map((p) => ({
        id: p.id,
        title: p.title,
        vendor: p.vendor,
        price: p.min_price,
        priceMax: p.max_price,
        image: p.image_url,
        url: p.product_url,
        marketplace: 'shopify',
      }));

      console.log(`[Shopify] Found ${transformed.length} products`);
      return { query, products: transformed };
    } catch (error) {
      console.error('[Shopify] API error; returning no products:', (error as Error).message);
      return { query, products: [] };
    }
  },
};
