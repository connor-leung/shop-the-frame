import { getPrisma } from '../db/prisma.js';
import { ResultGroup, ProductResult } from '../types.js';

export async function recordImpressions({ results }: { results: ResultGroup[] }): Promise<void> {
  if (!results?.length) return;

  const prisma = getPrisma();
  const products = results.flatMap((r) => r.products ?? []);

  const validProducts = products.filter((p): p is ProductResult & { id: string } => Boolean(p.id));
  console.log(
    `[Analytics] Recording ${validProducts.length} impression(s):`,
    validProducts.map((p) => p.id),
  );

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  await Promise.all(
    validProducts.map(async (p) => {
      const record = await prisma.productAnalytics.upsert({
        where: { productId: String(p.id) },
        create: {
          productId: String(p.id),
          productUrl: p.url ?? null,
          platform: p.marketplace ?? null,
          impressions: 1,
        },
        update: { impressions: { increment: 1 } },
      });
      await prisma.productAnalyticsMonthly.upsert({
        where: { productAnalyticsId_month_year: { productAnalyticsId: record.id, month, year } },
        create: { productAnalyticsId: record.id, month, year, impressions: 1 },
        update: { impressions: { increment: 1 } },
      });
    }),
  );

  console.log(`[Analytics] Impressions saved for ${validProducts.length} product(s)`);
}

export async function recordClick({
  productId,
  productUrl,
}: {
  productId: string;
  productUrl?: string | null;
}): Promise<void> {
  if (!productId) return;

  console.log(`[Analytics] Recording click for product: ${productId}`);

  const prisma = getPrisma();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const record = await prisma.productAnalytics.upsert({
    where: { productId: String(productId) },
    create: { productId: String(productId), productUrl: productUrl ?? null, clicks: 1 },
    update: { clicks: { increment: 1 } },
  });
  await prisma.productAnalyticsMonthly.upsert({
    where: { productAnalyticsId_month_year: { productAnalyticsId: record.id, month, year } },
    create: { productAnalyticsId: record.id, month, year, clicks: 1 },
    update: { clicks: { increment: 1 } },
  });

  console.log(`[Analytics] Click saved for product: ${productId}`);
}
