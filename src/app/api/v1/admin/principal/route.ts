import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { createPrincipalSchema } from "@/schemas/principal/principal.schema";
import { requireApiPermission } from "@/server/auth";
import { PrincipalService } from "@/services/principal";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.PRINCIPAL_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new PrincipalService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Principal messages retrieved successfully"
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.PRINCIPAL_CREATE);

  const input = await parseJsonBody(request, createPrincipalSchema);

  const principal = await new PrincipalService().create(input);

  return jsonCreated(principal, "Principal message created successfully");
});
