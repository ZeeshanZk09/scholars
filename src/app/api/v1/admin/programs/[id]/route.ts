import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateProgramSchema } from "@/schemas/program/program.schema";
import { requireApiPermission } from "@/server/auth";
import { ProgramService } from "@/services/programs";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateProgramSchema);

  const program = await new ProgramService().update(id, input, actor);

  return jsonSuccess(program, "Program updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new ProgramService().remove(id);

  return jsonSuccess({ id }, "Program deleted successfully");
});
