import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import {
  jsonCreated,
  jsonSuccessPaged,
  paginationMeta,
} from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import {
  admissionCategoryValues,
  admissionStatusValues,
  createAdmissionPeriodSchema,
} from "@/schemas/admission/admission.schema";
import { requireApiPermission } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const category = parseEnumFilter(url, "category", admissionCategoryValues);
  const status = parseEnumFilter(url, "status", admissionStatusValues);

  const { items, total } = await new AdmissionsService().listPeriods({
    skip,
    take,
    category,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Admission periods retrieved successfully",
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.ADMISSION_MANAGE);

  const input = await parseJsonBody(request, createAdmissionPeriodSchema);

  const period = await new AdmissionsService().createPeriod(input, actor);

  return jsonCreated(period, "Admission period created successfully");
});
