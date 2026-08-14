import { getRouteParam, withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { updateUserSchema } from "@/schemas/user/user.schema";
import { requireApiPermission } from "@/server/auth";
import { UserService } from "@/services/users";

export const PATCH = withApiHandler(async (_ctx, request, routeContext) => {
  await requireApiPermission(PERMISSIONS.USER_UPDATE);

  const id = await getRouteParam(routeContext, "id");
  const input = await parseJsonBody(request, updateUserSchema);

  const user = await new UserService().updateUser(id, input);

  return jsonSuccess(user, "User updated successfully");
});

export const DELETE = withApiHandler(async (_ctx, _request, routeContext) => {
  await requireApiPermission(PERMISSIONS.USER_DELETE);

  const id = await getRouteParam(routeContext, "id");

  await new UserService().removeUser(id);

  return jsonSuccess({ id }, "User deleted successfully");
});
