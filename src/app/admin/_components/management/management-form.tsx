"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ManagementFormData = {
  name: string;
  designation: string;
  imageUrl: string;
  biography: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type ManagementFormProps = {
  mode: "create" | "edit";
  initial?: Partial<ManagementFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function ManagementForm({
  mode,
  initial,
}: Readonly<ManagementFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ManagementFormData>({
    name: initial?.name ?? "",
    designation: initial?.designation ?? "",
    imageUrl: initial?.imageUrl ?? "",
    biography: initial?.biography ?? "",
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof ManagementFormData>(
    key: K,
    value: ManagementFormData[K],
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
      designation: form.designation.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      biography: form.biography.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/management/${initial?.id}`
          : "/api/v1/admin/management",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save management member");
      }

      toast.success(
        mode === "edit"
          ? "Management member updated"
          : "Management member created",
      );
      router.push("/admin/management");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save management member",
      );
    } finally {
      setSaving(false);
    }
  }

  let buttonText = "Create Management Member";
  if (saving) {
    buttonText = "Saving...";
  } else if (mode === "edit") {
    buttonText = "Save Changes";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
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
            placeholder="e.g. Mr. Ali Hassan"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-slate-900"
          >
            Designation
          </label>
          <input
            id="designation"
            type="text"
            value={form.designation}
            onChange={(event) => setField("designation", event.target.value)}
            placeholder="e.g. Chairman, Managing Director"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="biography"
          className="block text-sm font-medium text-slate-900"
        >
          Biography
        </label>
        <textarea
          id="biography"
          value={form.biography}
          onChange={(event) => setField("biography", event.target.value)}
          rows={4}
          placeholder="A short biography of the management member."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-slate-900"
        >
          Image URL
        </label>
        <input
          id="imageUrl"
          type="text"
          value={form.imageUrl}
          onChange={(event) => setField("imageUrl", event.target.value)}
          placeholder="https://example.com/manager.jpg"
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
                event.target.value as ManagementFormData["status"],
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
          href="/admin/management"
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
