import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updatePrincipalSchema } from "@/schemas/principal/principal.schema";
import { requireApiPermission } from "@/server/auth";
import { PrincipalService } from "@/services/principal";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.PRINCIPAL_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updatePrincipalSchema);

  const principal = await new PrincipalService().update(id, input);

  return jsonSuccess(principal, "Principal message updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.PRINCIPAL_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new PrincipalService().remove(id);

  return jsonSuccess({ id }, "Principal message deleted successfully");
});
