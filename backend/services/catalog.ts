import { searchProducts } from './catalogClient.js';
import { CatalogSearchResult, ProductResult } from '../types.js';

const HAS_SHOPIFY_CREDS = Boolean(
  process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET,
);

export function normalizeProductSource(source: string | undefined): string {
  if (source === 'amazon' || source === 'all') return source;
  return 'shopify';
}

export async function searchCatalog(
  query: string,
  limit = 5,
  source = 'shopify',
): Promise<CatalogSearchResult> {
  return searchShopifyCatalog(query, limit);
}

export async function searchShopifyCatalog(
  query: string,
  limit = 5,
): Promise<CatalogSearchResult> {
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

    console.log(`[Shopify] Transformed products sample:`, transformed[0]);

    return { query, products: transformed };
  } catch (error) {
    console.error('[Shopify] API error; returning no products:', (error as Error).message);
    return { query, products: [] };
  }
}
