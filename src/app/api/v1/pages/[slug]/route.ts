import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { PageService } from "@/services/pages";

export const GET = withApiHandler(async (_ctx, _request, routeContext) => {
  const slug = await getRouteParam(routeContext, "slug");

  const page = await new PageService().getPublishedBySlug(slug);

  return jsonSuccess(page, "Page retrieved successfully");
});
