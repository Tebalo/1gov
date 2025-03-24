-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT,
    "caseId" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "description" TEXT,
    "metadata" TEXT
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT,
    "caseId" TEXT NOT NULL,
    "caseType" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "AuditTrail_caseId_caseType_idx" ON "AuditTrail"("caseId", "caseType");

-- CreateIndex
CREATE INDEX "AuditTrail_timestamp_idx" ON "AuditTrail"("timestamp");

-- CreateIndex
CREATE INDEX "AuditTrail_action_idx" ON "AuditTrail"("action");

-- CreateIndex
CREATE INDEX "AuditTrail_userId_idx" ON "AuditTrail"("userId");

-- CreateIndex
CREATE INDEX "Comment_caseId_caseType_idx" ON "Comment"("caseId", "caseType");
