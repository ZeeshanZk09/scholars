import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenCheck } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ProgramService } from "@/services/programs";

export const metadata: Metadata = {
  title: "Programs Module",
  robots: { index: false, follow: false },
};

export default async function AdminProgramsPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/programs`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const { total } = await new ProgramService().listForAdmin({ skip: 0, take: 1 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Programs Module</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage college intermediate programs, streams and eligibility.
          </p>
        </div>
      </div>

      <Link
        href="/admin/college/programs"
        className="block rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-slate-900">{total}</span>
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">College Programs</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Intermediate programs with academic streams, subjects and eligibility.
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-slate-700">
          Manage Programs →
        </span>
      </Link>
    </div>
  );
}