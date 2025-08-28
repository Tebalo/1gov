-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT,
    "caseId" TEXT,
    "caseType" TEXT
);

-- CreateIndex
CREATE INDEX "Draft_userId_formType_idx" ON "Draft"("userId", "formType");

-- CreateIndex
CREATE INDEX "Draft_caseId_caseType_idx" ON "Draft"("caseId", "caseType");

-- CreateIndex
CREATE UNIQUE INDEX "Draft_userId_formType_caseId_key" ON "Draft"("userId", "formType", "caseId");
