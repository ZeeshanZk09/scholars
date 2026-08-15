import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { FacilityForm } from "../../_components/facilities/facility-form";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "New Facility",
  robots: { index: false, follow: false },
};

export default async function NewFacilityPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/facilities/new`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_CREATE)) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/facilities"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Facilities
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">New Facility</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a campus facility such as a laboratory, library or playground.
        </p>
      </div>

      <FacilityForm mode="create" />
    </div>
  );
}
