import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import {
  jsonCreated,
  jsonSuccessPaged,
  paginationMeta,
} from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { createComputerCourseSchema } from "@/schemas/computer-course/computer-course.schema";
import { requireApiPermission } from "@/server/auth";
import { ComputerCourseService } from "@/services/computer-courses";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new ComputerCourseService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Computer courses retrieved successfully",
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createComputerCourseSchema);

  const course = await new ComputerCourseService().create(input, actor);

  return jsonCreated(course, "Computer course created successfully");
});
