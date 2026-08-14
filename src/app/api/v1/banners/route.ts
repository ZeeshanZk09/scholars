import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { BannerService } from "@/services/banners";

export const GET = withApiHandler(async () => {
  const banners = await new BannerService().listPublished();

  return jsonSuccess(banners, "Banners retrieved successfully");
});
