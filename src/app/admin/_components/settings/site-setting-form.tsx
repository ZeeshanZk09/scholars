"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SiteSettingFormData = {
  key: string;
  value: string;
  group: string;
  description: string;
};

type SiteSettingFormProps = {
  mode: "create" | "edit";
  initial?: Partial<SiteSettingFormData> & { id?: string };
};

export function SiteSettingForm({ mode, initial }: Readonly<SiteSettingFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SiteSettingFormData>({
    key: initial?.key ?? "",
    value: initial?.value ?? "",
    group: initial?.group ?? "",
    description: initial?.description ?? "",
  });

  function setField<K extends keyof SiteSettingFormData>(key: K, value: SiteSettingFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.key.trim()) {
      toast.error("Key is required");
      return;
    }

    setSaving(true);

    const body = {
      key: form.key.trim(),
      value: form.value,
      group: form.group.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/site-settings/${initial?.id}`
          : "/api/v1/admin/site-settings",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save site setting");
      }

      toast.success(mode === "edit" ? "Site setting updated" : "Site setting created");
      router.push("/admin/settings");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save site setting");
    } finally {
      setSaving(false);
    }
  }

  let submitButtonText = "Create Setting";
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-slate-900">
            Key <span className="text-red-600">*</span>
          </label>
          <input
            id="key"
            type="text"
            disabled={mode === "edit"}
            value={form.key}
            onChange={(event) => setField("key", event.target.value)}
            placeholder="e.g. site_name"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
          />
          <p className="mt-1 text-xs text-slate-500">
            Lowercase letters, numbers and underscores only.
          </p>
        </div>

        <div>
          <label htmlFor="group" className="block text-sm font-medium text-slate-900">
            Group
          </label>
          <input
            id="group"
            type="text"
            value={form.group}
            onChange={(event) => setField("group", event.target.value)}
            placeholder="e.g. general"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-slate-900">
          Value
        </label>
        <textarea
          id="value"
          value={form.value}
          onChange={(event) => setField("value", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-900">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
          placeholder="What this setting is used for"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/settings"
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
