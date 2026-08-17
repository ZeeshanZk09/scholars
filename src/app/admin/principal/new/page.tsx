import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { PrincipalForm } from "../../_components/principal/principal-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New Principal Message",
  robots: { index: false, follow: false },
};

export default async function NewPrincipalPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/principal/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.PRINCIPAL_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/principal"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Principal Message
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Principal Message</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add the principal&apos;s welcome message and biography to display on the website.
        </p>
      </div>

      <PrincipalForm mode="create" />
    </div>
  );
}
