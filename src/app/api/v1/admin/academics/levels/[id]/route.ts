import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateAcademicLevelSchema } from "@/schemas/academics/school.schema";
import { requireApiPermission } from "@/server/auth";
import { SchoolService } from "@/services/academics";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateAcademicLevelSchema);

  const level = await new SchoolService().updateLevel(id, input, actor);

  return jsonSuccess(level, "Academic level updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new SchoolService().removeLevel(id);

  return jsonSuccess({ id }, "Academic level deleted successfully");
});
