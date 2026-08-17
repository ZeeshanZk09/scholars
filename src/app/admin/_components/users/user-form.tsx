"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

type UserFormProps = {
  mode: "create" | "edit";
  initial?: Partial<UserFormData> & { id?: string };
};

const ROLE_OPTIONS = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

export function UserForm({ mode, initial }: Readonly<UserFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserFormData>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    password: "",
    role: initial?.role ?? "EDITOR",
    status: initial?.status ?? "ACTIVE",
  });

  function setField<K extends keyof UserFormData>(
    key: K,
    value: UserFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (mode === "create" && !form.password) {
      toast.error("Password is required");
      return;
    }

    setSaving(true);

    const body: Record<string, unknown> = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    };

    if (mode === "create" || form.password) {
      body.password = form.password;
    }

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/users/${initial?.id}`
          : "/api/v1/admin/users",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save user");
      }

      toast.success(mode === "edit" ? "User updated" : "User created");
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save user",
      );
    } finally {
      setSaving(false);
    }
  }

  const actionText = mode === "edit" ? "Save Changes" : "Create User";
  const buttonText = saving ? "Saving..." : actionText;

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
          placeholder="e.g. Ayesha Khan"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-900"
        >
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => setField("email", event.target.value)}
          placeholder="e.g. ayesha@example.com"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-900"
        >
          {mode === "create" ? "Password" : "New Password"}
          {mode === "create" ? <span className="text-red-600"> *</span> : null}
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(event) => setField("password", event.target.value)}
          placeholder={
            mode === "create"
              ? "At least 8 characters"
              : "Leave blank to keep current password"
          }
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-slate-900"
          >
            Role
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(event) =>
              setField("role", event.target.value as UserFormData["role"])
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

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
              setField("status", event.target.value as UserFormData["status"])
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
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href="/admin/users/list"
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
