import { withApiHandler } from "@/lib/api/api-handler";
import { signOut } from "@/lib/auth";
import { jsonSuccess } from "@/lib/response/api-response";
import { assertSameOrigin } from "@/lib/security/same-origin";
import { getApiUser } from "@/server/auth";

export const POST = withApiHandler(async (_ctx, request) => {
  assertSameOrigin(request);

  const user = await getApiUser();

  await signOut({ redirect: false });

  return jsonSuccess({ userId: user.id }, "Signed out successfully");
});
