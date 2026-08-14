import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateContactMessageStatusSchema } from "@/schemas/contact/contact.schema";
import { requireApiPermission } from "@/server/auth";
import { ContactService } from "@/services/contact";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.CMS_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateContactMessageStatusSchema);

  await new ContactService().updateStatus(id, input.status);

  return jsonSuccess({ id, status: input.status }, "Contact message updated successfully");
});