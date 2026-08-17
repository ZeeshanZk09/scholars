import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateBlogTagSchema } from "@/schemas/blog/tag.schema";
import { requireApiPermission } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.BLOG_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateBlogTagSchema);

  await new BlogService().updateTag(id, input);

  return jsonSuccess({ id }, "Blog tag updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.BLOG_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new BlogService().deleteTag(id);

  return jsonSuccess({ id }, "Blog tag deleted successfully");
});
