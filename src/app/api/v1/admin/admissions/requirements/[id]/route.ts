import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateAdmissionRequirementSchema } from "@/schemas/admission/admission.schema";
import { requireApiPermission } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateAdmissionRequirementSchema);

  const requirement = await new AdmissionsService().updateRequirement(
    id,
    input,
  );

  return jsonSuccess(requirement, "Admission requirement updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const id = await getRouteParam(routeContext, "id");

  await new AdmissionsService().deleteRequirement(id);

  return jsonSuccess({ id }, "Admission requirement deleted successfully");
});
