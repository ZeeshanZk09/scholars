import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { type User } from "next-auth";

import { FacilityForm } from "../../_components/facilities/facility-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { FacilityService } from "@/services/facilities";

export const metadata: Metadata = {
  title: "Edit Facility",
  robots: { index: false, follow: false },
};

export default async function EditFacilityPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/facilities`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let facility;

  try {
    facility = await new FacilityService().getById(id);
  } catch {
    notFound();
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
        <h1 className="text-lg font-semibold text-slate-900">Edit Facility</h1>
        <p className="mt-1 text-sm text-slate-600">{facility.name}</p>
      </div>

      <FacilityForm
        mode="edit"
        initial={{
          id: facility.id,
          name: facility.name,
          slug: facility.slug,
          description: facility.description ?? "",
          imageUrl: facility.imageUrl ?? "",
          icon: facility.icon ?? "",
          status: facility.status,
          displayOrder: facility.displayOrder,
        }}
      />
    </div>
  );
}
