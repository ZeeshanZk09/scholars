"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type MessageStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";

type MessageStatusButtonProps = {
  id: string;
  current: MessageStatus;
};

const STATUS_OPTIONS: { value: MessageStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "ARCHIVED", label: "Archived" },
];

export function MessageStatusButton({
  id,
  current,
}: Readonly<MessageStatusButtonProps>) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const status = event.target.value as MessageStatus;

    if (status === current) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/v1/admin/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update message status");
      }

      toast.success("Message status updated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update message status",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={updating}
      className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
