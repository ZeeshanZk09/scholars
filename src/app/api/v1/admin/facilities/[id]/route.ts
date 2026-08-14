import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateFacilitySchema } from "@/schemas/facility/facility.schema";
import { requireApiPermission } from "@/server/auth";
import { FacilityService } from "@/services/facilities";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateFacilitySchema);

  const facility = await new FacilityService().update(id, input, actor);

  return jsonSuccess(facility, "Facility updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new FacilityService().remove(id);

  return jsonSuccess({ id }, "Facility deleted successfully");
});
