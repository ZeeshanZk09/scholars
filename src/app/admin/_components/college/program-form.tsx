"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ProgramFormData = {
  name: string;
  slug: string;
  groupName: string;
  description: string;
  subjects: string;
  eligibility: string;
  duration: string;
  admissionRequirements: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type ProgramFormProps = {
  mode: "create" | "edit";
  initial?: Partial<ProgramFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function ProgramForm({ mode, initial }: ProgramFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProgramFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    groupName: initial?.groupName ?? "",
    description: initial?.description ?? "",
    subjects: initial?.subjects ?? "",
    eligibility: initial?.eligibility ?? "",
    duration: initial?.duration ?? "",
    admissionRequirements: initial?.admissionRequirements ?? "",
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof ProgramFormData>(key: K, value: ProgramFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      groupName: form.groupName.trim() || undefined,
      description: form.description.trim() || undefined,
      subjects: form.subjects.trim() || undefined,
      eligibility: form.eligibility.trim() || undefined,
      duration: form.duration.trim() || undefined,
      admissionRequirements: form.admissionRequirements.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit" ? `/api/v1/admin/programs/${initial?.id}` : "/api/v1/admin/programs",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save program");
      }

      toast.success(mode === "edit" ? "Program updated" : "Program created");
      router.push("/admin/college/programs");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save program");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-900">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="e.g. FSc Pre-Medical"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-900">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={form.slug}
            onChange={(event) => setField("slug", event.target.value)}
            placeholder="auto-generated"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-slate-900">
            Academic Stream / Group
          </label>
          <input
            id="groupName"
            type="text"
            value={form.groupName}
            onChange={(event) => setField("groupName", event.target.value)}
            placeholder="e.g. Science"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-900">
            Duration
          </label>
          <input
            id="duration"
            type="text"
            value={form.duration}
            onChange={(event) => setField("duration", event.target.value)}
            placeholder="e.g. 2 Years"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="eligibility" className="block text-sm font-medium text-slate-900">
            Eligibility
          </label>
          <input
            id="eligibility"
            type="text"
            value={form.eligibility}
            onChange={(event) => setField("eligibility", event.target.value)}
            placeholder="e.g. Matric with 60% or above"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-900">
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

      <div>
        <label htmlFor="subjects" className="block text-sm font-medium text-slate-900">
          Subjects
        </label>
        <input
          id="subjects"
          type="text"
          value={form.subjects}
          onChange={(event) => setField("subjects", event.target.value)}
          placeholder="e.g. Biology, Chemistry, Physics"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="admissionRequirements" className="block text-sm font-medium text-slate-900">
          Admission Requirements
        </label>
        <textarea
          id="admissionRequirements"
          value={form.admissionRequirements}
          onChange={(event) => setField("admissionRequirements", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-900">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) => setField("status", event.target.value as ProgramFormData["status"])}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="displayOrder" className="block text-sm font-medium text-slate-900">
            Display Order
          </label>
          <input
            id="displayOrder"
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(event) => setField("displayOrder", Number(event.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/college/programs"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Program"}
        </button>
      </div>
    </form>
  );
}