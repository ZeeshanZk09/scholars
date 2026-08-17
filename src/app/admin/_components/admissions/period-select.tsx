"use client";

import { useRouter } from "next/navigation";

type PeriodSelectProps = {
  value: string;
  periods: { id: string; label: string }[];
  emptyLabel: string;
};

export function PeriodSelect({
  value,
  periods,
  emptyLabel,
}: Readonly<PeriodSelectProps>) {
  const router = useRouter();

  return (
    <select
      defaultValue={value}
      onChange={(event) => {
        router.push(
          `/admin/admissions/requirements?periodId=${encodeURIComponent(event.target.value)}`,
        );
      }}
      className="mt-1 w-full max-w-lg rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
    >
      {periods.length === 0 ? (
        <option value="">{emptyLabel}</option>
      ) : (
        periods.map((period) => (
          <option key={period.id} value={period.id}>
            {period.label}
          </option>
        ))
      )}
    </select>
  );
}
