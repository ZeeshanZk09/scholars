import { withApiHandler } from "@/lib/api/api-handler";
import { jsonSuccess } from "@/lib/response/api-response";
import { signOut } from "@/lib/auth";
import { getApiUser } from "@/server/auth";

export const POST = withApiHandler(async () => {
  const user = await getApiUser();

  await signOut({ redirect: false });

  return jsonSuccess({ userId: user.id }, "Signed out successfully");
});
