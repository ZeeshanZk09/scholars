import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { createManagementSchema } from "@/schemas/management/management.schema";
import { requireApiPermission } from "@/server/auth";
import { ManagementService } from "@/services/management";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.MANAGEMENT_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new ManagementService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Management members retrieved successfully"
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.MANAGEMENT_CREATE);

  const input = await parseJsonBody(request, createManagementSchema);

  const member = await new ManagementService().create(input);

  return jsonCreated(member, "Management member created successfully");
});
