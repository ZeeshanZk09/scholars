import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

import { ProgramForm } from "../../../_components/college/program-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "New College Program",
  robots: { index: false, follow: false },
};

export default async function NewCollegeProgramPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/college/programs/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/college/programs"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Programs
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Program</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add an intermediate program such as FSc Pre-Medical or ICS Computer
          Science.
        </p>
      </div>

      <ProgramForm mode="create" />
    </div>
  );
}
