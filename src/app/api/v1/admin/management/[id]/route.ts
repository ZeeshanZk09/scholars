import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateManagementSchema } from "@/schemas/management/management.schema";
import { requireApiPermission } from "@/server/auth";
import { ManagementService } from "@/services/management";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.MANAGEMENT_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateManagementSchema);

  const member = await new ManagementService().update(id, input);

  return jsonSuccess(member, "Management member updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.MANAGEMENT_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new ManagementService().remove(id);

  return jsonSuccess({ id }, "Management member deleted successfully");
});
