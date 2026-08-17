import { withApiHandler } from "@/lib/api/api-handler";
import { parseJsonBody } from "@/lib/api/parse-body";
import { jsonCreated, jsonSuccess } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createPageSchema } from "@/schemas/pages/page.schema";
import { requireApiPermission } from "@/server/auth";
import { PageService } from "@/services/pages";

export const GET = withApiHandler(async () => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const pages = await new PageService().listForAdmin();

  return jsonSuccess(pages, "Pages retrieved successfully");
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.CMS_CREATE);

  const input = await parseJsonBody(request, createPageSchema);

  const page = await new PageService().create(input, actor);

  return jsonCreated(page, "Page created successfully");
});
