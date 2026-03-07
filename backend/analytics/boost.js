import { getPrisma } from '../db/prisma.js';

export async function recordImpressions({ results }) {
  if (!results?.length) return;

  const prisma = getPrisma();
  const products = results.flatMap((r) => r.products ?? []);

  const validProducts = products.filter((p) => p.id);
  console.log(`[Analytics] Recording ${validProducts.length} impression(s):`, validProducts.map((p) => p.id));

  await Promise.all(
    validProducts.map((p) =>
      prisma.productAnalytics.upsert({
        where: { productId: String(p.id) },
        create: { productId: String(p.id), productUrl: p.product_url ?? p.url ?? null, platform: p.marketplace ?? null, impressions: 1 },
        update: { impressions: { increment: 1 } },
      })
    )
  );

  console.log(`[Analytics] Impressions saved for ${validProducts.length} product(s)`);
}

export async function recordClick({ productId, productUrl }) {
  if (!productId) return;

  console.log(`[Analytics] Recording click for product: ${productId}`);

  const prisma = getPrisma();
  await prisma.productAnalytics.upsert({
    where: { productId: String(productId) },
    create: { productId: String(productId), productUrl: productUrl ?? null, clicks: 1 },
    update: { clicks: { increment: 1 } },
  });

  console.log(`[Analytics] Click saved for product: ${productId}`);
}
