export interface CatalogProvider {
  search(query: string, limit: number): Promise<CatalogSearchResult>;
}

// shopify.ts types
export interface ProductResult {
  id: string | null;
  title: string;
  vendor: string | null;
  price: string | null;
  priceMax: string | null;
  image: string | null;
  url: string | null;
  marketplace: string;
}

export interface CatalogSearchResult {
  query: string;
  products: ProductResult[];
}

// gemini.ts types
export interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

export interface FrameItem {
  item: string;
  confidence: number;
}

export interface ResultGroup {
  item: { query: string; confidence: number };
  products: ProductResult[];
}

export interface AnalyzeImageOptions {
  productSource?: string;
  catalogSearch?: (query: string, limit: number, source: string) => Promise<CatalogSearchResult>;
}

export interface AnalyzeImageResult {
  frameItems: FrameItem[];
  results: ResultGroup[];
}

// catalogClient.ts types

export interface TokenCache {
  accessToken: string | null;
  expiresAt: number;
}

export interface TokenResponse {
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

export interface RawProduct {
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

export interface RawVariant {
  id?: string;
  price?: { amount?: number };
  media?: { url?: string }[];
  variantUrl?: string;
  shop?: { name?: string };
}

export interface McpResult {
  content?: Array<{ type: string; text: string }>;
}

