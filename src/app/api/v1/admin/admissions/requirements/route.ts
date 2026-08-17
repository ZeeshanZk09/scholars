import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createAdmissionRequirementSchema } from "@/schemas/admission/admission.schema";
import { requireApiPermission } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const POST = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const input = await parseJsonBody(request, createAdmissionRequirementSchema);

  const requirement = await new AdmissionsService().createRequirement(input);

  return jsonCreated(requirement, "Admission requirement created successfully");
});
