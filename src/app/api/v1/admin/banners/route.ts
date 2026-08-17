import { withApiHandler } from "@/lib/api/api-handler";
import { parseEnumFilter, parsePagination } from "@/lib/api/pagination";
import { parseJsonBody } from "@/lib/api/parse-body";
import {
  jsonCreated,
  jsonSuccessPaged,
  paginationMeta,
} from "@/lib/response/api-response";
import { PERMISSIONS } from "@/lib/security/permissions";
import { createBannerSchema } from "@/schemas/banner/banner.schema";
import { contentStatusValues } from "@/schemas/common/content.schema";
import { requireApiPermission } from "@/server/auth";
import { BannerService } from "@/services/banners";

export const GET = withApiHandler(async (_ctx, request) => {
  await requireApiPermission(PERMISSIONS.BANNER_READ);

  const url = new URL(request.url);
  const { page, limit, skip, take } = parsePagination(url);
  const status = parseEnumFilter(url, "status", contentStatusValues);

  const { items, total } = await new BannerService().listForAdmin({
    skip,
    take,
    status,
  });

  return jsonSuccessPaged(
    items,
    paginationMeta(page, limit, total),
    "Banners retrieved successfully",
  );
});

export const POST = withApiHandler(async (_ctx, request) => {
  const actor = await requireApiPermission(PERMISSIONS.BANNER_CREATE);

  const input = await parseJsonBody(request, createBannerSchema);

  const banner = await new BannerService().create(input, actor);

  return jsonCreated(banner, "Banner created successfully");
});
