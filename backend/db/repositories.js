import { Prisma } from '@prisma/client';
import { getPrisma } from './prisma.js';

function mapSessionRow(row) {
  return {
    sessionId: row.sessionId,
    videoId: row.videoId,
    timestampSec: row.timestampSec,
    frameHash: row.frameHash,
    items: row.items || [],
    results: row.results || [],
    createdAt: row.createdAt,
  };
}

export async function findRecentSessionByFrameHash(frameHash, cutoff) {
  const prisma = getPrisma();
  const row = await prisma.session.findFirst({
    where: {
      frameHash,
      createdAt: {
        gte: cutoff,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return row ? mapSessionRow(row) : null;
}

export async function createSession(session) {
  const prisma = getPrisma();
  await prisma.session.create({
    data: {
      sessionId: session.sessionId,
      videoId: session.videoId ?? null,
      timestampSec: session.timestampSec ?? null,
      frameHash: session.frameHash,
      items: session.items || [],
      results: session.results || [],
    },
  });
}

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
  await prisma.analyticsEvent.create({
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
  });
}

export async function getInsights(since, limit) {
  const prisma = getPrisma();
  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 10;

  const [
    topDetectedResult,
    topClickedResult,
    topQueriesResult,
    ctrResult,
    latencyResult,
  ] = await Promise.all([
    prisma.$queryRaw`
      SELECT item_category AS category, COUNT(*)::int AS count
      FROM events
      WHERE type = 'item_impression'
        AND created_at >= ${since}
        AND item_category IS NOT NULL
      GROUP BY item_category
      ORDER BY count DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT item_category AS category, COUNT(*)::int AS count
      FROM events
      WHERE type = 'product_click'
        AND created_at >= ${since}
        AND item_category IS NOT NULL
      GROUP BY item_category
      ORDER BY count DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT
        result_item.query AS query,
        COUNT(*)::int AS count
      FROM sessions s
      CROSS JOIN LATERAL jsonb_array_elements(s.results) AS result_group
      CROSS JOIN LATERAL (
        SELECT NULLIF(TRIM(result_group->'item'->>'query'), '') AS query
      ) AS result_item
      WHERE s.created_at >= ${since}
        AND result_item.query IS NOT NULL
      GROUP BY result_item.query
      ORDER BY count DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT
        item_category AS category,
        COUNT(*) FILTER (WHERE type = 'item_impression')::int AS impressions,
        COUNT(*) FILTER (WHERE type = 'product_click')::int AS clicks,
        CASE
          WHEN COUNT(*) FILTER (WHERE type = 'item_impression') > 0
          THEN (COUNT(*) FILTER (WHERE type = 'product_click')::double precision
            / COUNT(*) FILTER (WHERE type = 'item_impression')::double precision)
          ELSE 0
        END AS ctr
      FROM events
      WHERE created_at >= ${since}
        AND item_category IS NOT NULL
      GROUP BY item_category
      ORDER BY ctr DESC
      LIMIT ${Prisma.raw(String(normalizedLimit))}
    `,
    prisma.$queryRaw`
      SELECT
        percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms) AS p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95
      FROM events
      WHERE type = 'shop_frame_latency'
        AND created_at >= ${since}
        AND latency_ms IS NOT NULL
    `,
  ]);

  const latency = latencyResult[0] || { p50: null, p95: null };

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
