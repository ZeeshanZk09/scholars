import { withApiHandler } from "@/lib/api/api-handler";
import { parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createUserSchema } from "@/schemas/user/user.schema";
import { requireApiPermission } from "@/server/auth";
import { UserService } from "@/services/users";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.USER_READ);

  const { page, limit, skip, take } = parsePagination(new URL(request.url));

  const { items, total } = await new UserService().listForAdmin({ skip, take });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Users retrieved successfully"
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.USER_CREATE);

  const input = await parseJsonBody(request, createUserSchema);

  const user = await new UserService().createUser(input);

  return jsonCreated(user, "User created successfully");
});
