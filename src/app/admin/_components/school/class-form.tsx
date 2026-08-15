"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ClassFormData = {
  name: string;
  slug: string;
  description: string;
  eligibility: string;
  learningOutcomes: string;
  levelId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type ClassFormProps = {
  mode: "create" | "edit";
  initial?: Partial<ClassFormData> & { id?: string };
  levels: { id: string; name: string }[];
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function ClassForm({ mode, initial, levels }: Readonly<ClassFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ClassFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    eligibility: initial?.eligibility ?? "",
    learningOutcomes: initial?.learningOutcomes ?? "",
    levelId: initial?.levelId ?? levels[0]?.id ?? "",
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof ClassFormData>(key: K, value: ClassFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.levelId) {
      toast.error("Academic level is required");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      eligibility: form.eligibility.trim() || undefined,
      learningOutcomes: form.learningOutcomes.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/academics/classes/${initial?.id}`
          : "/api/v1/admin/academics/classes",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save school class");
      }

      toast.success(mode === "edit" ? "Class updated" : "Class created");
      router.push("/admin/school/classes");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save school class");
    } finally {
      setSaving(false);
    }
  }

  let submitButtonText = "Create Class";
  if (saving) {
    submitButtonText = "Saving...";
  } else if (mode === "edit") {
    submitButtonText = "Save Changes";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-900">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="e.g. Grade 1"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-900">
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={form.slug}
          onChange={(event) => setField("slug", event.target.value)}
          placeholder="auto-generated from name"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Leave empty to generate automatically from the name.
        </p>
      </div>

      <div>
        <label htmlFor="levelId" className="block text-sm font-medium text-slate-900">
          Academic Level <span className="text-red-600">*</span>
        </label>
        <select
          id="levelId"
          value={form.levelId}
          onChange={(event) => setField("levelId", event.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          {levels.length === 0 ? (
            <option value="">No academic levels available</option>
          ) : (
            levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))
          )}
        </select>
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
        <label htmlFor="eligibility" className="block text-sm font-medium text-slate-900">
          Eligibility
        </label>
        <input
          id="eligibility"
          type="text"
          value={form.eligibility}
          onChange={(event) => setField("eligibility", event.target.value)}
          placeholder="e.g. Age 5 by March 31"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="learningOutcomes" className="block text-sm font-medium text-slate-900">
          Learning Outcomes
        </label>
        <textarea
          id="learningOutcomes"
          value={form.learningOutcomes}
          onChange={(event) => setField("learningOutcomes", event.target.value)}
          rows={4}
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
            onChange={(event) => setField("status", event.target.value as ClassFormData["status"])}
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
          href="/admin/school/classes"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}
