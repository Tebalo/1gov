-- AlterTable
ALTER TABLE "notifications" ADD COLUMN "draft_id" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Draft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT,
    "caseId" TEXT,
    "caseType" TEXT
);
INSERT INTO "new_Draft" ("caseId", "caseType", "content", "createdAt", "formType", "id", "updatedAt", "userId", "userName", "userRole") SELECT "caseId", "caseType", "content", "createdAt", "formType", "id", "updatedAt", "userId", "userName", "userRole" FROM "Draft";
DROP TABLE "Draft";
ALTER TABLE "new_Draft" RENAME TO "Draft";
CREATE INDEX "Draft_userId_formType_idx" ON "Draft"("userId", "formType");
CREATE INDEX "Draft_caseId_caseType_idx" ON "Draft"("caseId", "caseType");
CREATE UNIQUE INDEX "Draft_userId_formType_caseId_key" ON "Draft"("userId", "formType", "caseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
