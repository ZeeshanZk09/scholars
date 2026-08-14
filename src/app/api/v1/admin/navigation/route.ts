import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createNavigationItemSchema } from "@/schemas/navigation/navigation.schema";
import { requireApiPermission } from "@/server/auth";
import { NavigationService } from "@/services/navigation";

export const GET = withApiHandler(async () => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const items = await new NavigationService().listForAdmin();

  return jsonSuccess(items, "Navigation items retrieved successfully");
});

export const POST = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createNavigationItemSchema);

  const item = await new NavigationService().create(input);

  return jsonCreated(item, "Navigation item created successfully");
});