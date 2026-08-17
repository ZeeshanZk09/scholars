import { withApiHandler } from "@/lib/api/api-handler";
import { parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import {
  jsonCreated,
  jsonSuccessPaged,
  paginationMeta,
} from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createFacultySchema } from "@/schemas/faculty/faculty.schema";
import { requireApiPermission } from "@/server/auth";
import { FacultyService } from "@/services/faculty";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);

  const { items, total } = await new FacultyService().list({ skip, take });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Faculty retrieved successfully",
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createFacultySchema);

  const faculty = await new FacultyService().create(input, actor.id);

  return jsonCreated(faculty, "Faculty created successfully");
});
