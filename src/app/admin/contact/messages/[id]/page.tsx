import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { hasPermission, PERMISSIONS } from "@/lib/security/permissions";
import { requireUser } from "@/server/auth";
import { ContactService } from "@/services/contact";
import { MessageStatusButton } from "../../../_components/contact/message-status-button";

export const metadata: Metadata = {
  title: "Message Details",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

function formatDate(value: Date): string {
  return value.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type DetailRow = {
  label: string;
  value: string | null;
  full?: boolean;
};

export default async function AdminContactMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let user;

  try {
    user = await requireUser();
  } catch {
    redirect(`/auth/login?callbackUrl=/admin/contact/messages`);
  }

  if (!hasPermission(user.role, PERMISSIONS.CMS_READ)) {
    redirect("/admin/unauthorized");
  }

  const { id } = await params;
  let message;

  try {
    message = await new ContactService().getById(id);
  } catch {
    notFound();
  }

  const rows: DetailRow[] = [
    { label: "Name", value: message.name },
    { label: "Email", value: message.email },
    { label: "Phone", value: message.phone },
    { label: "Subject", value: message.subject },
    { label: "Received", value: formatDate(message.createdAt) },
    { label: "Message", value: message.message, full: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/contact/messages"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Messages
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Message Details</h1>
          <p className="mt-1 text-sm text-slate-600">From {message.name}</p>
        </div>
        {hasPermission(user.role, PERMISSIONS.CMS_UPDATE) ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Status:</span>
            <MessageStatusButton id={message.id} current={message.status} />
          </div>
        ) : (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              STATUS_STYLES[message.status] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {message.status}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`rounded-lg border border-slate-200 bg-white p-4 ${
              row.full ? "sm:col-span-2" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {row.label}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-900">
              {row.value ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}