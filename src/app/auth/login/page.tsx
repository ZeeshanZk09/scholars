import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";

import type { Metadata } from "next";

import { getCurrentUser } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({
  searchParams,
}: Readonly<LoginPageProps>) {
  const { callbackUrl } = await searchParams;

  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return <LoginForm callbackUrl={callbackUrl ?? "/admin"} />;
}
