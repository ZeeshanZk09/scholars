import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { BlogService } from "@/services/blogs";

export const GET = withApiHandler(async (_ctx, _request, routeContext) => {
  const slug = await getRouteParam(routeContext, "slug");

  const post = await new BlogService().getPublishedBySlug(slug);

  return jsonSuccess(post, "Blog post retrieved successfully");
});
