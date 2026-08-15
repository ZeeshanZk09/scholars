import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { FacultyService } from "@/services/faculty";
import { DeleteButton } from "../../_components/school/delete-button";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Faculty",
  robots: { index: false, follow: false },
};

export default async function AdminFacultyListPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/faculty/list`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.CMS_CREATE);
  const canDelete = hasPermission(user.role, PERMISSIONS.CMS_DELETE);
  const { items: faculty } = await new FacultyService().list({ skip: 0, take: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/faculty"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Faculty
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Faculty</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage faculty profiles, designations, and display order.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/faculty/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Faculty
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 md:table-cell">Designation</th>
              <th className="hidden px-4 py-3 md:table-cell">Department</th>
              <th className="hidden px-4 py-3 md:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {faculty.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No faculty yet.
                </td>
              </tr>
            ) : (
              faculty.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {member.designation || "-"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {member.department || "-"}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {hasPermission(user.role, PERMISSIONS.CMS_UPDATE) ? (
                        <Link
                          href={`/admin/faculty/${member.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Pencil className="h-4 w-4 text-slate-300" />
                      )}
                      {canDelete ? (
                        <DeleteButton
                          id={member.id}
                          endpoint="/api/v1/admin/faculty"
                          label="Delete"
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
