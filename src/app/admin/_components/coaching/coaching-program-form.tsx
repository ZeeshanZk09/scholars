"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type CoachingFormData = {
  name: string;
  slug: string;
  category: string;
  description: string;
  targetStudents: string;
  subjects: string;
  duration: string;
  timing: string;
  feeInformation: string;
  admissionStatus: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type CoachingProgramFormProps = {
  mode: "create" | "edit";
  initial?: Partial<CoachingFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function CoachingProgramForm({
  mode,
  initial,
}: Readonly<CoachingProgramFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CoachingFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
    targetStudents: initial?.targetStudents ?? "",
    subjects: initial?.subjects ?? "",
    duration: initial?.duration ?? "",
    timing: initial?.timing ?? "",
    feeInformation: initial?.feeInformation ?? "",
    admissionStatus: initial?.admissionStatus ?? "",
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof CoachingFormData>(
    key: K,
    value: CoachingFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
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
      category: form.category.trim() || undefined,
      description: form.description.trim() || undefined,
      targetStudents: form.targetStudents.trim() || undefined,
      subjects: form.subjects.trim() || undefined,
      duration: form.duration.trim() || undefined,
      timing: form.timing.trim() || undefined,
      feeInformation: form.feeInformation.trim() || undefined,
      admissionStatus: form.admissionStatus.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/coaching/${initial?.id}`
          : "/api/v1/admin/coaching",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save coaching program");
      }

      toast.success(mode === "edit" ? "Program updated" : "Program created");
      router.push("/admin/coaching/programs");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save coaching program",
      );
    } finally {
      setSaving(false);
    }
  }
  let submitButtonText = "Create Program";
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
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-900"
        >
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="e.g. Matric Coaching"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-slate-900"
          >
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
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-900"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={form.category}
            onChange={(event) => setField("category", event.target.value)}
            placeholder="e.g. Board Exams"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
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

      <div>
        <label
          htmlFor="subjects"
          className="block text-sm font-medium text-slate-900"
        >
          Subjects / Classes
        </label>
        <input
          id="subjects"
          type="text"
          value={form.subjects}
          onChange={(event) => setField("subjects", event.target.value)}
          placeholder="e.g. Biology, Chemistry, Physics, Mathematics"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="targetStudents"
            className="block text-sm font-medium text-slate-900"
          >
            Target Students
          </label>
          <input
            id="targetStudents"
            type="text"
            value={form.targetStudents}
            onChange={(event) => setField("targetStudents", event.target.value)}
            placeholder="e.g. Students of Scholar School and external"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-slate-900"
          >
            Duration
          </label>
          <input
            id="duration"
            type="text"
            value={form.duration}
            onChange={(event) => setField("duration", event.target.value)}
            placeholder="e.g. Annual"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="timing"
            className="block text-sm font-medium text-slate-900"
          >
            Timing / Batches
          </label>
          <input
            id="timing"
            type="text"
            value={form.timing}
            onChange={(event) => setField("timing", event.target.value)}
            placeholder="e.g. Evening 4:00 PM – 7:00 PM"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="admissionStatus"
            className="block text-sm font-medium text-slate-900"
          >
            Admission Status
          </label>
          <input
            id="admissionStatus"
            type="text"
            value={form.admissionStatus}
            onChange={(event) =>
              setField("admissionStatus", event.target.value)
            }
            placeholder="e.g. Open / Limited Seats"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="feeInformation"
          className="block text-sm font-medium text-slate-900"
        >
          Fee Information
        </label>
        <input
          id="feeInformation"
          type="text"
          value={form.feeInformation}
          onChange={(event) => setField("feeInformation", event.target.value)}
          placeholder="e.g. Contact office for fee structure"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-900"
          >
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              setField(
                "status",
                event.target.value as CoachingFormData["status"],
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
        </div>

        <div>
          <label
            htmlFor="displayOrder"
            className="block text-sm font-medium text-slate-900"
          >
            Display Order
          </label>
          <input
            id="displayOrder"
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(event) =>
              setField("displayOrder", Number(event.target.value))
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/coaching/programs"
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
