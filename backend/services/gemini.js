import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { normalizeProductSource, searchCatalog } from './shopify.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

// Function declaration for Gemini function calling
const SEARCH_TOOL = {
  name: 'searchCatalog',
  description: 'Search the selected product catalog for purchasable items. Call this function for each distinct product you identify in the image. Make 5-8 calls total for different items.',
  parameters: {
    type: 'object',
    properties: {
      item: {
        type: 'string',
        description: 'Short label for the item you identified (e.g., "black tee", "leather crossbody bag").',
      },
      query: {
        type: 'string',
        description: 'A detailed, search-optimized product query. Include specific attributes like color, material, style, and brand (if visible). Example: "navy blue crew neck cashmere sweater" or "black leather crossbody bag with gold hardware"',
      },
      confidence: {
        type: 'number',
        description: 'Confidence in this item identification from 0.0 to 1.0.',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of products to return (1-5). Default is 3.',
      },
    },
    required: ['query'],
  },
};

const AGENT_PROMPT = `You are a shopping assistant that helps users find and purchase items they see in YouTube videos.

Analyze this video screenshot carefully. Your task is to:
1. Identify 5-8 distinct purchasable items visible in the image
2. For EACH item, call the searchCatalog function with a detailed search query

RULES FOR IDENTIFYING ITEMS:
- Only identify physical products that can be purchased
- Include specific details: color, material, pattern, style when clearly visible
- Only include brand names if a logo or text is CLEARLY visible
- Prioritize prominent, clearly visible items
- Ignore: people's faces, backgrounds, UI elements, non-purchasable items

RULES FOR SEARCH QUERIES:
- Be specific and descriptive (e.g., "distressed light wash high waisted mom jeans" not "jeans")
- Include color, material, style attributes when visible
- Optimize for ecommerce search engines
- Avoid generic words like "nice", "cool", "item"

Make exactly 5-8 function calls, one for each distinct item you identify.`;

export async function analyzeImageWithFunctionCalling(imagePath, options = {}) {
  const productSource = normalizeProductSource(options.productSource);
  const catalogSearch = typeof options.catalogSearch === 'function'
    ? options.catalogSearch
    : (query, limit, source) => searchCatalog(query, limit, source);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    tools: [{ functionDeclarations: [SEARCH_TOOL] }],
  });

  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'image/jpeg';

  console.log('[Gemini] Starting search query generation with function calling...');

  // Initial request with image
  const result = await model.generateContent([
    AGENT_PROMPT,
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
  ]);

  const response = result.response;
  const functionCalls = extractFunctionCalls(response);
  const frameItems = extractFrameItemsFromCalls(functionCalls);

  console.log(`[Gemini] Received ${functionCalls.length} function calls`);
  console.log(`[Gemini] Extracted ${frameItems.length} frame items`);

  // Execute all function calls in parallel
  const searchResults = await Promise.all(
    functionCalls.slice(0, 8).map(async (call) => {
      const { query, limit = 3 } = call.args;
      try {
        return await catalogSearch(query, limit, productSource);
      } catch (error) {
        console.error(`[Gemini] Search failed for "${query}":`, error.message);
        return { query, products: [] };
      }
    })
  );

  const results = buildRankedResults(functionCalls, searchResults);

  console.log(`[Gemini] Returning ${results.length} item result groups`);

  return {
    frameItems,
    results,
  };
}

function buildRankedResults(functionCalls, searchResults) {
  const seenUrls = new Set();
  const results = [];

  for (let i = 0; i < searchResults.length; i++) {
    const call = functionCalls[i];
    const result = searchResults[i];
    const products = dedupeAndRankProducts(result.products || [], seenUrls);

    results.push({
      item: {
        query: call.args?.query || result.query,
        confidence: toConfidence(call.args?.confidence),
      },
      products,
    });
  }

  return results;
}

function extractFunctionCalls(response) {
  const calls = [];

  for (const candidate of response.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.functionCall) {
        calls.push({
          name: part.functionCall.name,
          args: part.functionCall.args || {},
        });
      }
    }
  }

  return calls;
}

function extractFrameItemsFromCalls(functionCalls) {
  return functionCalls
    .slice(0, 8)
    .map((call) => {
      const item = String(call.args?.item || call.args?.query || '').trim();
      if (!item) return null;
      return {
        item,
        confidence: toConfidence(call.args?.confidence),
      };
    })
    .filter(Boolean);
}

function dedupeAndRankProducts(products, seenUrls) {
  const scored = [];

  for (const product of products) {
    if (!product) continue;
    // Use url or generate a unique key from title+vendor for deduplication
    const dedupeKey = product.url || `${product.title}-${product.vendor}`;
    if (seenUrls.has(dedupeKey)) continue;
    seenUrls.add(dedupeKey);

    scored.push({
      product,
      score: scoreProduct(product),
    });
  }

  console.log(`[Gemini] Dedupe: ${products.length} input -> ${scored.length} output`);

  return scored
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.product);
}

function scoreProduct(product) {
  let score = 0;
  if (product.image) score += 2;
  if (product.price) score += 2;
  if (product.vendor) score += 1;
  if (product.url) score += 1;
  return score;
}

function toConfidence(value) {
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(num)) return 0.5;
  return Math.max(0, Math.min(1, num));
}

// Keep the old function for backwards compatibility
export async function analyzeImage(imagePath, options = {}) {
  return analyzeImageWithFunctionCalling(imagePath, options);
}
