import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateBlogCategorySchema } from "@/schemas/blog/category.schema";
import { requireApiPermission } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.BLOG_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateBlogCategorySchema);

  await new BlogService().updateCategory(id, input);

  return jsonSuccess({ id }, "Blog category updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.BLOG_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new BlogService().deleteCategory(id);

  return jsonSuccess({ id }, "Blog category deleted successfully");
});
