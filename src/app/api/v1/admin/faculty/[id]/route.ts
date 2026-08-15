import { withApiHandler, getRouteParam } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateFacultySchema } from "@/schemas/faculty/faculty.schema";
import { requireApiPermission } from "@/server/auth";
import { FacultyService } from "@/services/faculty";

export const GET = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const id = await getRouteParam(routeContext, "id");
  const faculty = await new FacultyService().getById(id);

  return jsonSuccess(faculty, "Faculty retrieved successfully");
});

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateFacultySchema);

  const faculty = await new FacultyService().update(id, input, actor.id);

  return jsonSuccess(faculty, "Faculty updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");
  await new FacultyService().delete(id);

  return jsonSuccess(null, "Faculty deleted successfully");
});
