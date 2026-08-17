import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";

import { env } from "@/config/env";
import { clearLoginAttempts, recordLoginFailure } from "@/lib/security/rate-limit";
import { loginSchema } from "@/schemas/auth/login.schema";
import { prisma } from "@/server/db";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: env.AUTH_TRUST_HOST,
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
          await recordLoginFailure(key);
          return null;
        }

        if (user.status !== "ACTIVE") {
          await recordLoginFailure(key);
          return null;
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordValid) {
          await recordLoginFailure(key);
          return null;
        }

        await clearLoginAttempts(key);

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
