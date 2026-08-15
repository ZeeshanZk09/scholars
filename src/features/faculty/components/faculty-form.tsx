"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Faculty } from "@prisma/client";

type FacultyFormData = {
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  subject: string;
  profileImage: string;
  biography: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type FacultyFormProps = {
  initialData?: Faculty;
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function FacultyForm({ initialData }: FacultyFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const mode = initialData ? "edit" : "create";

  const [form, setForm] = useState<FacultyFormData>({
    name: initialData?.name ?? "",
    designation: initialData?.designation ?? "",
    department: initialData?.department ?? "",
    qualification: initialData?.qualification ?? "",
    experience: initialData?.experience ?? "",
    subject: initialData?.subject ?? "",
    profileImage: initialData?.profileImage ?? "",
    biography: initialData?.biography ?? "",
    status: (initialData?.status as FacultyFormData["status"]) ?? "DRAFT",
    displayOrder: initialData?.displayOrder ?? 0,
  });

  function setField<K extends keyof FacultyFormData>(key: K, value: FacultyFormData[K]) {
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
      designation: form.designation.trim() || null,
      department: form.department.trim() || null,
      qualification: form.qualification.trim() || null,
      experience: form.experience.trim() || null,
      subject: form.subject.trim() || null,
      profileImage: form.profileImage.trim() || null,
      biography: form.biography.trim() || null,
    };

    try {
      const response = await fetch(
        mode === "edit" ? `/api/v1/admin/faculty/${initialData?.id}` : "/api/v1/admin/faculty",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save faculty");
      }

      toast.success(mode === "edit" ? "Faculty member updated" : "Faculty member created");
      router.push("/admin/faculty/list");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save faculty");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-900">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label htmlFor="designation" className="block text-sm font-medium text-slate-900">
            Designation
          </label>
          <input
            id="designation"
            type="text"
            value={form.designation}
            onChange={(event) => setField("designation", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-slate-900">
            Department
          </label>
          <input
            id="department"
            type="text"
            value={form.department}
            onChange={(event) => setField("department", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-slate-900">
            Qualification
          </label>
          <input
            id="qualification"
            type="text"
            value={form.qualification}
            onChange={(event) => setField("qualification", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-slate-900">
            Experience
          </label>
          <input
            id="experience"
            type="text"
            value={form.experience}
            onChange={(event) => setField("experience", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-900">
            Subject / Expertise
          </label>
          <input
            id="subject"
            type="text"
            value={form.subject}
            onChange={(event) => setField("subject", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="profileImage" className="block text-sm font-medium text-slate-900">
          Profile Image URL
        </label>
        <input
          id="profileImage"
          type="text"
          value={form.profileImage}
          onChange={(event) => setField("profileImage", event.target.value)}
          placeholder="https://example.com/profile.jpg"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="biography" className="block text-sm font-medium text-slate-900">
          Biography
        </label>
        <textarea
          id="biography"
          value={form.biography}
          onChange={(event) => setField("biography", event.target.value)}
          rows={5}
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
            onChange={(event) =>
              setField("status", event.target.value as FacultyFormData["status"])
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
          href="/admin/faculty/list"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Faculty Member"}
        </button>
      </div>
    </form>
  );
}
