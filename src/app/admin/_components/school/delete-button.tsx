"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DeleteButtonProps = {
  id: string;
  endpoint: string;
  label?: string;
};

export function DeleteButton({
  id,
  endpoint,
  label = "Delete",
}: Readonly<DeleteButtonProps>) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to delete");
      }

      toast.success("Deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : label}
    </button>
  );
}
