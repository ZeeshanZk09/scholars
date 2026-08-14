import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateCoachingProgramSchema } from "@/schemas/coaching/coaching.schema";
import { requireApiPermission } from "@/server/auth";
import { CoachingProgramService } from "@/services/coaching";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateCoachingProgramSchema);

  const program = await new CoachingProgramService().update(id, input, actor);

  return jsonSuccess(program, "Coaching program updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new CoachingProgramService().remove(id);

  return jsonSuccess({ id }, "Coaching program deleted successfully");
});
