import { Prisma } from '@prisma/client';
import { getPrisma } from './prisma.js';

const CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function listCategoryBoostRows(since) {
  const prisma = getPrisma();
  const rows = await prisma.$queryRaw`
    SELECT
      category AS key,
      COUNT(*) FILTER (WHERE type = 'impression') AS impressions,
      COUNT(*) FILTER (WHERE type = 'click') AS clicks
    FROM analytics_events
    WHERE ts >= ${since} AND category IS NOT NULL
    GROUP BY category
  `;
  return rows;
}

export async function listQueryBoostRows(since) {
  const prisma = getPrisma();
  const rows = await prisma.$queryRaw`
    SELECT
      query AS key,
      COUNT(*) FILTER (WHERE type = 'impression') AS impressions,
      COUNT(*) FILTER (WHERE type = 'click') AS clicks
    FROM analytics_events
    WHERE ts >= ${since} AND query IS NOT NULL
    GROUP BY query
  `;
  return rows;
}

export async function insertAnalyticsImpressions(docs) {
  if (!docs.length) return;

  const prisma = getPrisma();
  await prisma.analyticsEvent.createMany({
    data: docs.map((doc) => ({
      type: doc.type,
      category: doc.category ?? null,
      query: doc.query ?? null,
      productId: doc.productId ?? null,
      productUrl: doc.productUrl ?? null,
      userId: doc.userId ?? null,
      requestId: doc.requestId ?? null,
      ts: doc.ts,
    })),
  });
}

export async function insertAnalyticsClick(doc) {
  const prisma = getPrisma();
  await prisma.$transaction([
    prisma.analyticsEvent.create({
      data: {
        type: doc.type,
        category: doc.category ?? null,
        query: doc.query ?? null,
        productId: doc.productId ?? null,
        productUrl: doc.productUrl ?? null,
        userId: doc.userId ?? null,
        requestId: doc.requestId ?? null,
        ts: doc.ts,
      },
    }),
    prisma.productClick.create({
      data: {
        userId: doc.userId || 'anonymous',
        requestId: doc.requestId ?? null,
        category: doc.category ?? null,
        query: doc.query ?? null,
        productId: doc.productId || doc.productUrl || 'unknown',
        productUrl: doc.productUrl ?? null,
        clickedAt: doc.ts ?? new Date(),
      },
    }),
  ]);
}

function normalizeQuery(query) {
  return String(query || '').trim().toLowerCase();
}

function normalizeSource(source) {
  const value = String(source || 'shopify').trim().toLowerCase();
  if (value === 'amazon' || value === 'all') return value;
  return 'shopify';
}

function mapCachedProducts(products) {
  return Array.isArray(products) ? products : [];
}

export async function findCachedCatalogQuery({ userId, query, productSource }) {
  if (!userId || !query) return null;
  const prisma = getPrisma();
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return null;

  const row = await prisma.catalogQueryCache.findUnique({
    where: {
      userId_query_productSource: {
        userId,
        query: normalizedQuery,
        productSource: normalizeSource(productSource),
      },
    },
  });

  if (!row) return null;
  if (Date.now() - row.updatedAt.getTime() > CATALOG_CACHE_TTL_MS) return null;

  await prisma.catalogQueryCache.update({
    where: { id: row.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    query,
    products: mapCachedProducts(row.products),
  };
}

export async function upsertCatalogQueryCache({ userId, query, productSource, products }) {
  if (!userId || !query) return;
  const prisma = getPrisma();
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return;
  const now = new Date();

  await prisma.catalogQueryCache.upsert({
    where: {
      userId_query_productSource: {
        userId,
        query: normalizedQuery,
        productSource: normalizeSource(productSource),
      },
    },
    update: {
      products: Array.isArray(products) ? products : [],
      updatedAt: now,
      lastUsedAt: now,
    },
    data: {
      userId,
      query: normalizedQuery,
      productSource: normalizeSource(productSource),
      products: Array.isArray(products) ? products : [],
      createdAt: now,
      lastUsedAt: now,
    },
  });
}

export async function upsertProductViews({ userId, results }) {
  if (!userId || !Array.isArray(results) || !results.length) return;
  const prisma = getPrisma();
  const now = new Date();
  const uniqueProducts = new Map();

  for (const group of results) {
    const products = Array.isArray(group?.products) ? group.products : [];
    for (const product of products) {
      const productId = String(product?.id || product?.url || '').trim();
      if (!productId) continue;
      if (!uniqueProducts.has(productId)) {
        uniqueProducts.set(productId, {
          productId,
          productUrl: product?.url ? String(product.url) : null,
        });
      }
    }
  }

  if (!uniqueProducts.size) return;

  const statements = [];
  for (const entry of uniqueProducts.values()) {
    statements.push(
      prisma.productView.upsert({
        where: {
          userId_productId: {
            userId,
            productId: entry.productId,
          },
        },
        update: {
          viewCount: { increment: 1 },
          lastSeenAt: now,
          productUrl: entry.productUrl,
        },
        create: {
          userId,
          productId: entry.productId,
          productUrl: entry.productUrl,
          firstSeenAt: now,
          lastSeenAt: now,
          viewCount: 1,
        },
      })
    );
  }

  await prisma.$transaction(statements);
}

export async function getInsights(since, limit) {
  const prisma = getPrisma();
  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 10;

  const [
    topDetectedResult,
    topClickedResult,
    topQueriesResult,
    ctrResult,
  ] = await Promise.all([
    prisma.$queryRaw`
      SELECT category, COUNT(*)::int AS count
      FROM analytics_events
      WHERE type = 'impression'
        AND ts >= ${since}
        AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT category, COUNT(*)::int AS count
      FROM analytics_events
      WHERE type = 'click'
        AND ts >= ${since}
        AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT
        query,
        COUNT(*)::int AS count
      FROM analytics_events
      WHERE ts >= ${since}
        AND query IS NOT NULL
        AND type = 'impression'
      GROUP BY query
      ORDER BY count DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT
        category,
        COUNT(*) FILTER (WHERE type = 'impression')::int AS impressions,
        COUNT(*) FILTER (WHERE type = 'click')::int AS clicks,
        CASE
          WHEN COUNT(*) FILTER (WHERE type = 'impression') > 0
          THEN (COUNT(*) FILTER (WHERE type = 'click')::double precision
            / COUNT(*) FILTER (WHERE type = 'impression')::double precision)
          ELSE 0
        END AS ctr
      FROM analytics_events
      WHERE ts >= ${since}
        AND category IS NOT NULL
      GROUP BY category
      ORDER BY ctr DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
  ]);

  const latency = { p50: null, p95: null };

  return {
    topDetectedCategories: topDetectedResult.map((entry) => ({
      category: entry.category,
      count: Number(entry.count),
    })),
    topClickedCategories: topClickedResult.map((entry) => ({
      category: entry.category,
      count: Number(entry.count),
    })),
    topItemQueries: topQueriesResult.map((entry) => ({
      query: entry.query,
      count: Number(entry.count),
    })),
    ctrByCategory: ctrResult.map((entry) => ({
      category: entry.category,
      impressions: Number(entry.impressions),
      clicks: Number(entry.clicks),
      ctr: Number(entry.ctr),
    })),
    latencyStats: {
      p50: latency.p50 == null ? null : Number(latency.p50),
      p95: latency.p95 == null ? null : Number(latency.p95),
    },
  };
}
