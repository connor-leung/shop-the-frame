import dotenv from 'dotenv';
dotenv.config();

const TOKEN_URL = 'https://api.shopify.com/auth/access_token';
const MCP_ENDPOINT = 'https://discover.shopifyapps.com/global/mcp';

interface TokenCache {
  accessToken: string | null;
  expiresAt: number;
}

interface TokenResponse {
  access_token: string;
  expires_in?: number;
}

export interface NormalizedProduct {
  id: string | null;
  title: string;
  image_url: string | null;
  min_price: string | null;
  max_price: string | null;
  product_url: string | null;
  vendor: string | null;
}

interface RawProduct {
  id?: string | null;
  product_id?: string | null;
  title?: string;
  name?: string;
  image_url?: string;
  featured_image?: string;
  images?: string[];
  min_price?: string | number;
  max_price?: string | number;
  price?: string | number;
  product_url?: string;
  url?: string;
  handle?: string;
  vendor?: string;
  brand?: string;
  variants?: RawVariant[];
  media?: { url?: string }[];
  priceRange?: { min?: { amount?: number }; max?: { amount?: number } };
  displayName?: string;
  lookupUrl?: string;
}

interface RawVariant {
  id?: string;
  price?: { amount?: number };
  media?: { url?: string }[];
  variantUrl?: string;
  shop?: { name?: string };
}

interface McpResult {
  content?: Array<{ type: string; text: string }>;
}

let tokenCache: TokenCache = {
  accessToken: null,
  expiresAt: 0,
};

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (tokenCache.accessToken && tokenCache.expiresAt > now + 60000) {
    console.log('[Shopify] Using cached token');
    return tokenCache.accessToken;
  }

  console.log('[Shopify] Fetching new access token...');

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are required');
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token request failed: ${response.status} - ${error}`);
  }

  const data = await response.json() as TokenResponse;
  const expiresIn = data.expires_in || 3600;
  tokenCache = { accessToken: data.access_token, expiresAt: now + expiresIn * 1000 };

  console.log(`[Shopify] Token obtained, expires in ${expiresIn}s`);
  return tokenCache.accessToken as string;
}

async function executeMcpTool(toolName: string, input: Record<string, unknown>): Promise<McpResult> {
  const token = await getAccessToken();

  const response = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name: toolName, arguments: input },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MCP request failed: ${response.status} - ${error}`);
  }

  const result = await response.json() as { result: McpResult; error?: { message?: string } };

  if (result.error) {
    throw new Error(`MCP error: ${result.error.message || JSON.stringify(result.error)}`);
  }

  return result.result;
}

export async function searchProducts(query: string, limit = 5): Promise<NormalizedProduct[]> {
  console.log(`[Shopify] Searching: "${query}" (limit: ${limit})`);

  try {
    const result = await executeMcpTool('search_global_products', { query, context: '', limit });

    const content = result?.content?.[0];
    if (!content || content.type !== 'text') {
      console.log('[Shopify] No results found');
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content.text);
    } catch (error) {
      console.warn('[Shopify] Failed to parse MCP text payload');
      console.warn('[Shopify] Raw content text:', content.text);
      throw error;
    }

    const products = normalizeProductsPayload(parsed);

    if (!Array.isArray(products)) {
      console.warn('[Shopify] Unexpected products payload shape');
      return [];
    }

    if (products[0]) {
      console.log('[Shopify] Raw MCP product sample:', JSON.stringify(products[0], null, 2));
    }

    const normalized = products.map(normalizeProduct);
    console.log(`[Shopify] Found ${normalized.length} products`);
    return normalized;
  } catch (error) {
    console.error(`[Shopify] Search error:`, (error as Error).message);
    throw error;
  }
}

function normalizeProductsPayload(parsed: unknown): RawProduct[] {
  if (Array.isArray(parsed)) return parsed as RawProduct[];
  if (parsed && typeof parsed === 'object') {
    const p = parsed as Record<string, unknown>;
    if (Array.isArray(p.products)) return p.products as RawProduct[];
    if (Array.isArray(p.items)) return p.items as RawProduct[];
    if (Array.isArray(p.results)) return p.results as RawProduct[];
    if (Array.isArray(p.offers)) return p.offers as RawProduct[];
  }
  return [];
}

function normalizeProduct(product: RawProduct): NormalizedProduct {
  if (product && product.id && product.title && product.variants) {
    return normalizeOffer(product);
  }
  return {
    title: product.title || product.name || 'Unknown Product',
    image_url: product.image_url || product.featured_image || product.images?.[0] || null,
    min_price: parsePrice(product.min_price || product.price || product.variants?.[0]?.price?.amount),
    max_price: parsePrice(product.max_price || product.price || product.variants?.[0]?.price?.amount),
    product_url: product.product_url || product.url || product.handle || null,
    vendor: product.vendor || product.brand || null,
    id: product.id || product.product_id || null,
  };
}

function normalizeOffer(offer: RawProduct): NormalizedProduct {
  const firstVariant = offer.variants?.[0];
  const firstMedia = offer.media?.[0];
  const minPrice = offer.priceRange?.min?.amount ?? firstVariant?.price?.amount;
  const maxPrice = offer.priceRange?.max?.amount ?? firstVariant?.price?.amount;

  return {
    title: offer.title || offer.displayName || 'Unknown Product',
    image_url: firstMedia?.url || firstVariant?.media?.[0]?.url || null,
    min_price: parsePrice(minPrice),
    max_price: parsePrice(maxPrice),
    product_url: firstVariant?.variantUrl || offer.lookupUrl || null,
    vendor: firstVariant?.shop?.name || null,
    id: offer.id || firstVariant?.id || null,
  };
}

function parsePrice(price: string | number | null | undefined): string | null {
  if (price === null || price === undefined) return null;
  if (typeof price === 'number') return price.toFixed(2);
  if (typeof price === 'string') {
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : num.toFixed(2);
  }
  return null;
}

export function clearTokenCache(): void {
  tokenCache = { accessToken: null, expiresAt: 0 };
}

export async function testConnection(): Promise<boolean> {
  console.log('[Shopify] Testing connection...');
  try {
    const results = await searchProducts('black tee white logo', 3);
    console.log('[Shopify] Connection test successful!');
    console.log('[Shopify] Sample results:', JSON.stringify(results, null, 2));
    return true;
  } catch (error) {
    console.error('[Shopify] Connection test failed:', (error as Error).message);
    return false;
  }
}
