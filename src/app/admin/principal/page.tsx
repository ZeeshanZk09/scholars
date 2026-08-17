import { MessageSquareQuote, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { PrincipalService } from "@/services/principal";

export const metadata: Metadata = {
  title: "Principal Message",
  robots: { index: false, follow: false },
};

export default async function AdminPrincipalPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/principal`);
  }

  if (!hasPermission(user.role, PERMISSIONS.PRINCIPAL_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.PRINCIPAL_CREATE);
  const { total } = await new PrincipalService().listForAdmin({
    skip: 0,
    take: 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Principal Message Module
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage the principal&apos;s welcome message and biography shown on
            the public website.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/principal/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Principal Message
          </Link>
        ) : null}
      </div>

      <Link
        href="/admin/principal/list"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">{total}</span>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">
          Principal Messages
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Principal messages with name, designation, message and display order.
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Principal Messages →
        </span>
      </Link>
    </div>
  );
}
