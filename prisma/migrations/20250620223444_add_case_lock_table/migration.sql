-- CreateTable
CREATE TABLE "CaseLock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "lockedBy" TEXT NOT NULL,
    "lockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "reason" TEXT,
    "metadata" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseLock_caseId_caseType_key" ON "CaseLock"("caseId", "caseType");
