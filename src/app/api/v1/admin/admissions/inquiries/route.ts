import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { requireApiPermission } from "@/server/auth";
import { AdmissionsService } from "@/services/admissions";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.ADMISSION_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", [
    "PENDING",
    "CONTACTED",
    "CLOSED",
  ] as const);

  const { items, total } = await new AdmissionsService().listInquiries({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Admission inquiries retrieved successfully",
  );
});
