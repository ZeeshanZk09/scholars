import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import {
  jsonCreated,
  jsonSuccessPaged,
  paginationMeta,
} from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createSchoolClassSchema } from "@/schemas/academics/school.schema";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { requireApiPermission } from "@/server/auth";
import { SchoolService } from "@/services/academics";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new SchoolService().listClassesForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "School classes retrieved successfully",
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createSchoolClassSchema);

  const schoolClass = await new SchoolService().createClass(input, actor);

  return jsonCreated(schoolClass, "School class created successfully");
});
