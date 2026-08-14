import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { jsonCreated, jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { createCoachingProgramSchema } from "@/schemas/coaching/coaching.schema";
import { requireApiPermission } from "@/server/auth";
import { CoachingProgramService } from "@/services/coaching";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new CoachingProgramService().listForAdmin({ skip, take, status });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Coaching programs retrieved successfully"
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createCoachingProgramSchema);

  const program = await new CoachingProgramService().create(input, actor);

  return jsonCreated(program, "Coaching program created successfully");
});
