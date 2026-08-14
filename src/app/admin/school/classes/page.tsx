import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { SchoolService } from "@/services/academics";
import { DeleteButton } from "../../_components/school/delete-button";

export const metadata: Metadata = {
  title: "Classes",
  robots: { index: false, follow: false },
};

export default async function AdminSchoolClassesPage() {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/school/classes`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const canCreate = hasPermission(user.role, PERMISSIONS.CMS_CREATE);
  const canDelete = hasPermission(user.role, PERMISSIONS.CMS_DELETE);
  const service = new SchoolService();

  const [classesResult, levelsResult] = await Promise.all([
    service.listClassesForAdmin({ skip: 0, take: 100 }),
    service.listLevelsForAdmin({ skip: 0, take: 100 }),
  ]);

  const levelNames = new Map(levelsResult.items.map((level) => [level.id, level.name]));
  const classes = classesResult.items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/school"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to School
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Classes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Individual classes from Nursery and KG to Grade 10.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/admin/school/classes/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Class
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 md:table-cell">Level</th>
              <th className="hidden px-4 py-3 md:table-cell">Order</th>
              <th className="hidden px-4 py-3 md:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No classes yet.
                </td>
              </tr>
            ) : (
              classes.map((schoolClass) => (
                <tr key={schoolClass.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {schoolClass.name}
                    <span className="block text-xs font-normal text-slate-500">
                      /{schoolClass.slug}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {levelNames.get(schoolClass.levelId) ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {schoolClass.displayOrder}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {schoolClass.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {hasPermission(user.role, PERMISSIONS.CMS_UPDATE) ? (
                        <Link
                          href={`/admin/school/classes/${schoolClass.id}`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <Pencil className="h-4 w-4 text-slate-300" />
                      )}
                      {canDelete ? (
                        <DeleteButton
                          id={schoolClass.id}
                          endpoint="/api/v1/admin/academics/classes"
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