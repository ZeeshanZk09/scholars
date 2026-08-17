-- CreateTable
CREATE TABLE "principal_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "profileImageUrl" TEXT,
    "message" TEXT NOT NULL,
    "biography" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "principal_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "imageUrl" TEXT,
    "biography" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "principal_messages_status_idx" ON "principal_messages"("status");

-- CreateIndex
CREATE INDEX "principal_messages_displayOrder_idx" ON "principal_messages"("displayOrder");

-- CreateIndex
CREATE INDEX "principal_messages_status_displayOrder_idx" ON "principal_messages"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "management_members_status_idx" ON "management_members"("status");

-- CreateIndex
CREATE INDEX "management_members_displayOrder_idx" ON "management_members"("displayOrder");

-- CreateIndex
CREATE INDEX "management_members_status_displayOrder_idx" ON "management_members"("status", "displayOrder");
