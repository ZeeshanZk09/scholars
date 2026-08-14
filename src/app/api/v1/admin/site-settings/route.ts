import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createSiteSettingSchema } from "@/schemas/settings/site-setting.schema";
import { requireApiPermission } from "@/server/auth";
import { SiteSettingService } from "@/services/settings";

export const GET = withApiHandler(async () => {
  await requireApiPermission(PERMISSIONS.SETTINGS_READ);

  const settings = await new SiteSettingService().listForAdmin();

  return jsonSuccess(settings, "Site settings retrieved successfully");
});

export const POST = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.SETTINGS_UPDATE);

  const input = await parseJsonBody(request, createSiteSettingSchema);

  const setting = await new SiteSettingService().create(input);

  return jsonCreated(setting, "Site setting created successfully");
});