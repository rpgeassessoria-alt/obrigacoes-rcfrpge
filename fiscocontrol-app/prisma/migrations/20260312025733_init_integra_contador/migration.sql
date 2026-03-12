-- AlterTable
ALTER TABLE "Client" ADD COLUMN "email" TEXT;
ALTER TABLE "Client" ADD COLUMN "nomeFantasia" TEXT;
ALTER TABLE "Client" ADD COLUMN "telefone" TEXT;

-- CreateTable
CREATE TABLE "SerproToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "scope" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IntegraLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "cnpj" TEXT,
    "status" INTEGER NOT NULL,
    "response" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IntegraCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cacheKey" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SerproToken_accessToken_key" ON "SerproToken"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "IntegraCache_cacheKey_key" ON "IntegraCache"("cacheKey");

-- CreateIndex
CREATE INDEX "IntegraCache_cacheKey_idx" ON "IntegraCache"("cacheKey");
