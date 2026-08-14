import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/server/auth";

export const metadata: Metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};

export default async function UnauthorizedPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-lg font-semibold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your role does not have permission to access this area. Ask a SUPER_ADMIN if you believe
        this is a mistake.
      </p>
      <Link
        href="/admin"
        className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
