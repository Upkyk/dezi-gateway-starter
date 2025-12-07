-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deziNummer" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "login_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "abonneeNummer" TEXT NOT NULL,
    "deziRoleCode" TEXT NOT NULL,
    "deziRoleName" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "login_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_deziNummer_key" ON "users"("deziNummer");

-- CreateIndex
CREATE INDEX "login_events_userId_idx" ON "login_events"("userId");

-- CreateIndex
CREATE INDEX "login_events_createdAt_idx" ON "login_events"("createdAt");
