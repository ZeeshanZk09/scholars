import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ContactService } from "@/services/contact";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

function formatDate(value: Date): string {
  return value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminContactMessagesPage() {
  let user: User;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/contact/messages`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const { items: messages } = await new ContactService().listForAdmin({ skip: 0, take: 100 });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/contact"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Contact Inquiries
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Messages</h1>
        <p className="mt-1 text-sm text-slate-600">
          Messages submitted from the contact form on the public Contact page.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 lg:table-cell">Subject</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No messages yet.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {message.name}
                    <span className="block text-xs font-normal text-slate-500">
                      {message.email}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                    {message.subject ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[message.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/contact/messages/${message.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
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
