import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateBlogSchema } from "@/schemas/blog/blog.schema";
import { requireApiPermission } from "@/server/auth";
import { BlogService } from "@/services/blogs";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.BLOG_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateBlogSchema);

  const blog = await new BlogService().updateBlog(id, input, actor);

  return jsonSuccess(blog, "Blog post updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.BLOG_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new BlogService().removeBlog(id);

  return jsonSuccess({ id }, "Blog post deleted successfully");
});
