import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { jsonSuccessPaged, paginationMeta } from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { contactMessageStatusValues } from "@/schemas/contact/contact.schema";
import { requireApiPermission } from "@/server/auth";
import { ContactService } from "@/services/contact";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.CMS_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contactMessageStatusValues);

  const { items, total } = await new ContactService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Contact messages retrieved successfully",
  );
});
