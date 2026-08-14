import { auth } from "@/lib/auth";
import { hasPermission, type Permission } from "@/lib/security/permissions";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError("Authentication required.");
  }

  return user;
}

export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireUser();

  if (!hasPermission(user.role, permission)) {
    throw new AuthorizationError("You do not have permission to perform this action.");
  }

  return user;
}
