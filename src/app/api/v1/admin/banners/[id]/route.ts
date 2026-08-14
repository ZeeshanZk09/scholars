import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateBannerSchema } from "@/schemas/banner/banner.schema";
import { requireApiPermission } from "@/server/auth";
import { BannerService } from "@/services/banners";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.BANNER_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateBannerSchema);

  const banner = await new BannerService().update(id, input, actor);

  return jsonSuccess(banner, "Banner updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.BANNER_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new BannerService().remove(id);

  return jsonSuccess({ id }, "Banner deleted successfully");
});
