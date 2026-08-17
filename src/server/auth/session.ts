import { auth } from "@/lib/auth";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { hasPermission, type Permission } from "@/lib/security/permissions";
import { prisma } from "@/server/db/prisma";

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Verify the user actually exists in the database and load their CURRENT
  // role and status. We intentionally read these from the DB rather than
  // trusting the JWT so that a permission change (e.g. demotion) or account
  // suspension takes effect immediately instead of lingering until the
  // session token expires.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, status: true },
  });

  if (!dbUser) {
    return null;
  }

  if (dbUser.status !== "ACTIVE") {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: dbUser.role,
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
