import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createBlogCategorySchema } from "@/schemas/blog/category.schema";
import { requireApiPermission } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const GET = withApiHandler(async () => {
  await requireApiPermission(PERMISSIONS.BLOG_READ);

  const categories = await new BlogService().listAllCategories();

  return jsonSuccess(categories, "Blog categories retrieved successfully");
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.BLOG_CREATE);

  const input = await parseJsonBody(request, createBlogCategorySchema);

  const category = await new BlogService().createCategory(input, actor);

  return jsonCreated(category, "Blog category created successfully");
});
