import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:\/\/.*@/, '://***@'));

  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  console.log('✓ Connected successfully');

  const analytics = await prisma.productAnalytics.count();
  console.log(`✓ product_analytics rows: ${analytics}`);

  const cache = await prisma.catalogQueryCache.count();
  console.log(`✓ catalog_query_cache rows: ${cache}`);
}

main()
  .catch((err) => {
    console.error('✗ Connection failed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
