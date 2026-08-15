/*
  Warnings:

  - The values [READ,REPLIED,CLOSED] on the enum `ContactMessageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactMessageStatus_new" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED');
ALTER TABLE "public"."contact_messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "contact_messages" ALTER COLUMN "status" TYPE "ContactMessageStatus_new" USING ("status"::text::"ContactMessageStatus_new");
ALTER TYPE "ContactMessageStatus" RENAME TO "ContactMessageStatus_old";
ALTER TYPE "ContactMessageStatus_new" RENAME TO "ContactMessageStatus";
DROP TYPE "public"."ContactMessageStatus_old";
ALTER TABLE "contact_messages" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "ctaLabel" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "seo_meta" ADD COLUMN     "keywords" TEXT;

-- CreateIndex
CREATE INDEX "academic_levels_status_displayOrder_idx" ON "academic_levels"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "admission_inquiries_status_createdAt_idx" ON "admission_inquiries"("status", "createdAt");

-- CreateIndex
CREATE INDEX "admission_periods_category_status_idx" ON "admission_periods"("category", "status");

-- CreateIndex
CREATE INDEX "banners_status_displayOrder_idx" ON "banners"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "banners_startDate_idx" ON "banners"("startDate");

-- CreateIndex
CREATE INDEX "banners_endDate_idx" ON "banners"("endDate");

-- CreateIndex
CREATE INDEX "blog_categories_status_displayOrder_idx" ON "blog_categories"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "blog_posts"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "coaching_programs_status_displayOrder_idx" ON "coaching_programs"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "college_programs_status_displayOrder_idx" ON "college_programs"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "computer_courses_status_displayOrder_idx" ON "computer_courses"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt");

-- CreateIndex
CREATE INDEX "facilities_status_displayOrder_idx" ON "facilities"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "faculties_status_displayOrder_idx" ON "faculties"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "pages_status_publishedAt_idx" ON "pages"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "school_classes_status_displayOrder_idx" ON "school_classes"("status", "displayOrder");

-- CreateIndex
CREATE INDEX "testimonials_status_displayOrder_idx" ON "testimonials"("status", "displayOrder");
