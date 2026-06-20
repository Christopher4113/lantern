-- CreateEnum
CREATE TYPE "InsiderType" AS ENUM ('POLITICIAN', 'EXECUTIVE', 'FUND_MANAGER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'OPTION', 'BOND', 'ETF', 'OTHER');

-- CreateEnum
CREATE TYPE "TradeAction" AS ENUM ('BUY', 'SELL', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "TradeSource" AS ENUM ('HOUSE_CLERK', 'SENATE_EFD', 'SEC_FORM4', 'SEC_13F');

-- CreateEnum
CREATE TYPE "RecommendedAction" AS ENUM ('STRONG_FOLLOW', 'WEAK_FOLLOW', 'MONITOR', 'IGNORE');

-- CreateTable
CREATE TABLE "Insider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InsiderType" NOT NULL,
    "imageUrl" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticker" (
    "symbol" TEXT NOT NULL,
    "companyName" TEXT,
    "sector" TEXT,
    "industry" TEXT,
    "cachedPrice" DECIMAL(18,4),
    "priceUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticker_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "insiderId" TEXT NOT NULL,
    "ticker" TEXT,
    "assetName" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "action" "TradeAction" NOT NULL,
    "amountLow" BIGINT,
    "amountHigh" BIGINT,
    "tradedAt" TIMESTAMP(3) NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "source" "TradeSource" NOT NULL,
    "sourceUrl" TEXT,
    "sourceFilingId" TEXT,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "significanceScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "signalCategory" TEXT[],
    "recommendedAction" "RecommendedAction" NOT NULL,
    "reasoning" TEXT,
    "modelVersion" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trade_sourceFilingId_key" ON "Trade"("sourceFilingId");

-- CreateIndex
CREATE INDEX "Trade_insiderId_idx" ON "Trade"("insiderId");

-- CreateIndex
CREATE INDEX "Trade_ticker_idx" ON "Trade"("ticker");

-- CreateIndex
CREATE INDEX "Trade_tradedAt_idx" ON "Trade"("tradedAt");

-- CreateIndex
CREATE INDEX "Trade_source_idx" ON "Trade"("source");

-- CreateIndex
CREATE UNIQUE INDEX "Annotation_tradeId_key" ON "Annotation"("tradeId");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_insiderId_fkey" FOREIGN KEY ("insiderId") REFERENCES "Insider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_ticker_fkey" FOREIGN KEY ("ticker") REFERENCES "Ticker"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
