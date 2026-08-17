import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { UserForm } from "../../_components/users/user-form";

import type { Metadata } from "next";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { UserService } from "@/services/users";

export const metadata: Metadata = {
  title: "Edit User",
  robots: { index: false, follow: false },
};

export default async function EditUserPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/users/list`);
  }

  if (!hasPermission(user.role, PERMISSIONS.USER_UPDATE)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let record;

  try {
    record = await new UserService().getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users/list"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Users
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Edit User</h1>
        <p className="mt-1 text-sm text-slate-600">{record.name ?? record.email}</p>
      </div>

      <UserForm
        mode="edit"
        initial={{
          id: record.id,
          name: record.name ?? "",
          email: record.email,
          password: "",
          role: record.role,
          status: record.status,
        }}
      />
    </div>
  );
}
