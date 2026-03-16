-- CreateTable
CREATE TABLE "catalog_query_cache" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "product_source" TEXT NOT NULL DEFAULT 'shopify',
    "products" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "last_used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalog_query_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_analytics" (
    "id" BIGSERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_url" TEXT,
    "platform" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_analytics_monthly" (
    "id" BIGSERIAL NOT NULL,
    "product_analytics_id" BIGINT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_analytics_monthly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_catalog_query_cache_user_last_used" ON "catalog_query_cache"("user_id", "last_used_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_catalog_query_cache_user_query_source" ON "catalog_query_cache"("user_id", "query", "product_source");

-- CreateIndex
CREATE UNIQUE INDEX "product_analytics_product_id_key" ON "product_analytics"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_analytics_impressions" ON "product_analytics"("impressions" DESC);

-- CreateIndex
CREATE INDEX "idx_product_analytics_monthly_product" ON "product_analytics_monthly"("product_analytics_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_analytics_monthly" ON "product_analytics_monthly"("product_analytics_id", "month", "year");

-- AddForeignKey
ALTER TABLE "product_analytics_monthly" ADD CONSTRAINT "product_analytics_monthly_product_analytics_id_fkey" FOREIGN KEY ("product_analytics_id") REFERENCES "product_analytics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
