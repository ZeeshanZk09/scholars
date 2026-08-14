import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateSiteSettingSchema } from "@/schemas/settings/site-setting.schema";
import { requireApiPermission } from "@/server/auth";
import { SiteSettingService } from "@/services/settings";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.SETTINGS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateSiteSettingSchema);

  const setting = await new SiteSettingService().update(id, input);

  return jsonSuccess(setting, "Site setting updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.SETTINGS_UPDATE);

  const id = await getRouteParam(routeContext, "id");

  await new SiteSettingService().remove(id);

  return jsonSuccess({ id }, "Site setting deleted successfully");
});