import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updatePageSchema } from "@/schemas/pages/page.schema";
import { requireApiPermission } from "@/server/auth";
import { PageService } from "@/services/pages";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updatePageSchema);

  const page = await new PageService().update(id, input, actor);

  return jsonSuccess(page, "Page updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new PageService().remove(id);

  return jsonSuccess({ id }, "Page deleted successfully");
});
