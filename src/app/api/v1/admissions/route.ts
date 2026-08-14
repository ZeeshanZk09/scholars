import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter } from "@/lib/api/pagination";
import { jsonSuccess } from "@/lib/response/api-response";
import { admissionCategoryValues } from "@/schemas/admission/admission.schema";
import { AdmissionsService } from "@/services/admissions";

export const GET = withApiHandler(async (_ctx, request) => {
  const url = new URL(request.url);
  const category = parseEnumFilter(url, "category", admissionCategoryValues);

  const period = await new AdmissionsService().getCurrentPeriod(category);

  return jsonSuccess(period, "Current admission period retrieved successfully");
});
