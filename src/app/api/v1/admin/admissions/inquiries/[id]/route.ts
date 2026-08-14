import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createInquiryStatusSchema } from "@/schemas/admission/admission.schema";
import { requireApiPermission } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, createInquiryStatusSchema);

  await new AdmissionsService().updateInquiryStatus(id, input.status);

  return jsonSuccess({ id, status: input.status }, "Admission inquiry updated successfully");
});