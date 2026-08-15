"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type InquiryStatus = "PENDING" | "CONTACTED" | "CLOSED";

type InquiryStatusButtonProps = {
  id: string;
  current: InquiryStatus;
};

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED", label: "Closed" },
];

export function InquiryStatusButton({ id, current }: Readonly<InquiryStatusButtonProps>) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const status = event.target.value as InquiryStatus;

    if (status === current) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/v1/admin/admissions/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update application status");
      }

      toast.success("Application status updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update application status");
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
