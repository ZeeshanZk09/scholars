import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { loginSchema } from "@/schemas/auth/login.schema";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

type AttemptRecord = { count: number; lockedUntil: number };

const loginAttempts = new Map<string, AttemptRecord>();

function isLoginLocked(email: string): boolean {
  const record = loginAttempts.get(email);

  return Boolean(record && record.lockedUntil > Date.now());
}

function recordFailedAttempt(email: string): void {
  const now = Date.now();
  const record = loginAttempts.get(email);

  if (!record || record.lockedUntil < now) {
    loginAttempts.set(email, { count: 1, lockedUntil: 0 });
    return;
  }

  record.count += 1;

  if (record.count >= LOGIN_MAX_ATTEMPTS) {
    record.lockedUntil = now + LOGIN_WINDOW_MS;
  }
}

function clearLoginAttempts(email: string): void {
  loginAttempts.delete(email);
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const key = email.toLowerCase();

        if (isLoginLocked(key)) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: key },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            passwordHash: true,
            status: true,
          },
        });

        if (!user?.passwordHash) {
          recordFailedAttempt(key);
          return null;
        }

        if (user.status !== "ACTIVE") {
          recordFailedAttempt(key);
          return null;
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordValid) {
          recordFailedAttempt(key);
          return null;
        }

        clearLoginAttempts(key);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;