"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type PrincipalFormData = {
  name: string;
  designation: string;
  profileImageUrl: string;
  message: string;
  biography: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
};

type PrincipalFormProps = {
  mode: "create" | "edit";
  initial?: Partial<PrincipalFormData> & { id?: string };
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function PrincipalForm({
  mode,
  initial,
}: Readonly<PrincipalFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PrincipalFormData>({
    name: initial?.name ?? "",
    designation: initial?.designation ?? "",
    profileImageUrl: initial?.profileImageUrl ?? "",
    message: initial?.message ?? "",
    biography: initial?.biography ?? "",
    status: initial?.status ?? "DRAFT",
    displayOrder: initial?.displayOrder ?? 0,
  });

  function setField<K extends keyof PrincipalFormData>(
    key: K,
    value: PrincipalFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.message.trim()) {
      toast.error("Message is required");
      return;
    }

    setSaving(true);

    const body = {
      ...form,
      name: form.name.trim(),
      designation: form.designation.trim() || undefined,
      profileImageUrl: form.profileImageUrl.trim() || undefined,
      message: form.message.trim(),
      biography: form.biography.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/principal/${initial?.id}`
          : "/api/v1/admin/principal",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save principal message");
      }

      toast.success(
        mode === "edit"
          ? "Principal message updated"
          : "Principal message created",
      );
      router.push("/admin/principal");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save principal message",
      );
    } finally {
      setSaving(false);
    }
  }

  let buttonText = "Create Principal Message";
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
            placeholder="e.g. Dr. Ahmed Khan"
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
            placeholder="e.g. Principal, Scholar School"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-900"
        >
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
          rows={5}
          placeholder="The principal's welcome message to the community."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
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
          placeholder="A short biography of the principal."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="profileImageUrl"
          className="block text-sm font-medium text-slate-900"
        >
          Profile Image URL
        </label>
        <input
          id="profileImageUrl"
          type="text"
          value={form.profileImageUrl}
          onChange={(event) => setField("profileImageUrl", event.target.value)}
          placeholder="https://example.com/principal.jpg"
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
                event.target.value as PrincipalFormData["status"],
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
          href="/admin/principal"
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
