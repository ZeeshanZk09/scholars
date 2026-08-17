import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { createProgramSchema } from "@/schemas/program/program.schema";
import { requireApiPermission } from "@/server/auth";
import { ProgramService } from "@/services/programs";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new ProgramService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Programs retrieved successfully"
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createProgramSchema);

  const program = await new ProgramService().create(input, actor);

  return jsonCreated(program, "Program created successfully");
});
