import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateAdmissionPeriodSchema } from "@/schemas/admission/admission.schema";
import { requireApiPermission } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateAdmissionPeriodSchema);

  const period = await new AdmissionsService().updatePeriod(id, input, actor);

  return jsonSuccess(period, "Admission period updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const id = await getRouteParam(routeContext, "id");

  await new AdmissionsService().deletePeriod(id);

  return jsonSuccess({ id }, "Admission period deleted successfully");
});
