import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateNavigationItemSchema } from "@/schemas/navigation/navigation.schema";
import { requireApiPermission } from "@/server/auth";
import { NavigationService } from "@/services/navigation";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateNavigationItemSchema);

  const item = await new NavigationService().update(id, input);

  return jsonSuccess(item, "Navigation item updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new NavigationService().remove(id);

  return jsonSuccess({ id }, "Navigation item deleted successfully");
});
