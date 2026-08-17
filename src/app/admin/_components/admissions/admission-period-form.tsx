"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SyntheticEvent, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdmissionPeriodFormData = {
  sessionId: string;
  category: "SCHOOL" | "COLLEGE" | "COACHING" | "COMPUTER_COURSES";
  title: string;
  description: string;
  openingDate: string;
  closingDate: string;
  status: "COMING_SOON" | "OPEN" | "CLOSED";
  isActive: boolean;
};

type AdmissionPeriodFormProps = {
  mode: "create" | "edit";
  initial?: Partial<AdmissionPeriodFormData> & { id?: string };
  sessions: { id: string; name: string }[];
};

const CATEGORY_OPTIONS = [
  { value: "SCHOOL", label: "School" },
  { value: "COLLEGE", label: "College" },
  { value: "COACHING", label: "Coaching" },
  { value: "COMPUTER_COURSES", label: "Computer Courses" },
] as const;

const STATUS_OPTIONS = ["COMING_SOON", "OPEN", "CLOSED"] as const;

function toDateTimeLocal(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function AdmissionPeriodForm({
  mode,
  initial,
  sessions,
}: Readonly<AdmissionPeriodFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdmissionPeriodFormData>({
    sessionId: initial?.sessionId ?? sessions[0]?.id ?? "",
    category: initial?.category ?? "SCHOOL",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    openingDate: toDateTimeLocal(initial?.openingDate),
    closingDate: toDateTimeLocal(initial?.closingDate),
    status: initial?.status ?? "COMING_SOON",
    isActive: initial?.isActive ?? false,
  });

  function setField<K extends keyof AdmissionPeriodFormData>(
    key: K,
    value: AdmissionPeriodFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    const body = {
      sessionId: form.sessionId,
      category: form.category,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      openingDate: form.openingDate
        ? new Date(form.openingDate).toISOString()
        : undefined,
      closingDate: form.closingDate
        ? new Date(form.closingDate).toISOString()
        : undefined,
      status: form.status,
      isActive: form.isActive,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/admissions/periods/${initial?.id}`
          : "/api/v1/admin/admissions/periods",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save admission period");
      }

      toast.success(
        mode === "edit"
          ? "Admission period updated"
          : "Admission period created",
      );
      router.push("/admin/admissions/periods");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save admission period",
      );
    } finally {
      setSaving(false);
    }
  }

  const submitText = mode === "edit" ? "Save Changes" : "Create Period";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-900"
          >
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(event) =>
              setField(
                "category",
                event.target.value as AdmissionPeriodFormData["category"],
              )
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="session"
            className="block text-sm font-medium text-slate-900"
          >
            Academic Session
          </label>
          <select
            id="session"
            value={form.sessionId}
            onChange={(event) => setField("sessionId", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-900"
        >
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(event) => setField("title", event.target.value)}
          placeholder="e.g. School Admissions 2026-27"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-900"
        >
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="openingDate"
            className="block text-sm font-medium text-slate-900"
          >
            Opening Date & Time
          </label>
          <input
            id="openingDate"
            type="datetime-local"
            value={form.openingDate}
            onChange={(event) => setField("openingDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="closingDate"
            className="block text-sm font-medium text-slate-900"
          >
            Closing Date & Time
          </label>
          <input
            id="closingDate"
            type="datetime-local"
            value={form.closingDate}
            onChange={(event) => setField("closingDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-900"
          >
            Admission Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              setField(
                "status",
                event.target.value as AdmissionPeriodFormData["status"],
              )
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            OPEN periods accept applications; COMING_SOON and CLOSED periods do
            not.
          </p>
        </div>

        <Label className="flex items-center gap-2 pt-6 text-sm font-medium text-slate-900">
          <Input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setField("isActive", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active (featured on the public site)
        </Label>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/admissions/periods"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
