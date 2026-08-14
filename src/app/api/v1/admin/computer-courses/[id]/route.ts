import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateComputerCourseSchema } from "@/schemas/computer-course/computer-course.schema";
import { requireApiPermission } from "@/server/auth";
import { ComputerCourseService } from "@/services/computer-courses";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateComputerCourseSchema);

  const course = await new ComputerCourseService().update(id, input, actor);

  return jsonSuccess(course, "Computer course updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new ComputerCourseService().remove(id);

  return jsonSuccess({ id }, "Computer course deleted successfully");
});
