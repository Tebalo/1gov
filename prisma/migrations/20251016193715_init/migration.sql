/*
  Warnings:

  - You are about to alter the column `content` on the `Draft` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Draft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" JSONB NOT NULL,
    "formType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "currentStep" INTEGER,
    "fields" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT,
    "caseId" TEXT,
    "caseType" TEXT
);
INSERT INTO "new_Draft" ("caseId", "caseType", "content", "createdAt", "currentStep", "fields", "formType", "id", "status", "updatedAt", "userId", "userName", "userRole") SELECT "caseId", "caseType", "content", "createdAt", "currentStep", "fields", "formType", "id", "status", "updatedAt", "userId", "userName", "userRole" FROM "Draft";
DROP TABLE "Draft";
ALTER TABLE "new_Draft" RENAME TO "Draft";
CREATE INDEX "Draft_userId_formType_idx" ON "Draft"("userId", "formType");
CREATE INDEX "Draft_caseId_caseType_idx" ON "Draft"("caseId", "caseType");
CREATE UNIQUE INDEX "Draft_userId_formType_caseId_key" ON "Draft"("userId", "formType", "caseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
