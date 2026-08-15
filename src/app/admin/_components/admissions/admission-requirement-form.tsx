"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AdmissionRequirementFormData = {
  admissionPeriodId: string;
  eligibility: string;
  requiredDocuments: string;
  applicationProcess: string;
  importantDates: string;
  feeInformation: string;
  prospectusUrl: string;
  instructions: string;
  contactInformation: string;
};

type AdmissionRequirementFormProps = {
  mode: "create" | "edit";
  initial?: Partial<AdmissionRequirementFormData> & { id?: string };
  periods: { id: string; title: string; category: string; status: string }[];
};

export function AdmissionRequirementForm({
  mode,
  initial,
  periods,
}: Readonly<AdmissionRequirementFormProps>) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdmissionRequirementFormData>({
    admissionPeriodId: initial?.admissionPeriodId ?? periods[0]?.id ?? "",
    eligibility: initial?.eligibility ?? "",
    requiredDocuments: initial?.requiredDocuments ?? "",
    applicationProcess: initial?.applicationProcess ?? "",
    importantDates: initial?.importantDates ?? "",
    feeInformation: initial?.feeInformation ?? "",
    prospectusUrl: initial?.prospectusUrl ?? "",
    instructions: initial?.instructions ?? "",
    contactInformation: initial?.contactInformation ?? "",
  });

  function setField<K extends keyof AdmissionRequirementFormData>(
    key: K,
    value: AdmissionRequirementFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);

    const body = {
      admissionPeriodId: form.admissionPeriodId,
      eligibility: form.eligibility.trim() || undefined,
      requiredDocuments: form.requiredDocuments.trim() || undefined,
      applicationProcess: form.applicationProcess.trim() || undefined,
      importantDates: form.importantDates.trim() || undefined,
      feeInformation: form.feeInformation.trim() || undefined,
      prospectusUrl: form.prospectusUrl.trim() || undefined,
      instructions: form.instructions.trim() || undefined,
      contactInformation: form.contactInformation.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/v1/admin/admissions/requirements/${initial?.id}`
          : "/api/v1/admin/admissions/requirements",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save admission requirement");
      }

      toast.success(
        mode === "edit" ? "Admission requirement updated" : "Admission requirement created"
      );
      router.push(
        `/admin/admissions/requirements?periodId=${encodeURIComponent(form.admissionPeriodId)}`
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save admission requirement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-slate-900">
          Admission Period
        </label>
        <select
          id="period"
          value={form.admissionPeriodId}
          disabled={mode === "edit"}
          onChange={(event) => setField("admissionPeriodId", event.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50"
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.title} ({period.category.replace("_", " ")} — {period.status})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="eligibility" className="block text-sm font-medium text-slate-900">
          Eligibility
        </label>
        <textarea
          id="eligibility"
          value={form.eligibility}
          onChange={(event) => setField("eligibility", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="requiredDocuments" className="block text-sm font-medium text-slate-900">
          Required Documents
        </label>
        <textarea
          id="requiredDocuments"
          value={form.requiredDocuments}
          onChange={(event) => setField("requiredDocuments", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="applicationProcess" className="block text-sm font-medium text-slate-900">
          Application Process
        </label>
        <textarea
          id="applicationProcess"
          value={form.applicationProcess}
          onChange={(event) => setField("applicationProcess", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="importantDates" className="block text-sm font-medium text-slate-900">
            Important Dates
          </label>
          <textarea
            id="importantDates"
            value={form.importantDates}
            onChange={(event) => setField("importantDates", event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="feeInformation" className="block text-sm font-medium text-slate-900">
            Fee Information
          </label>
          <textarea
            id="feeInformation"
            value={form.feeInformation}
            onChange={(event) => setField("feeInformation", event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="prospectusUrl" className="block text-sm font-medium text-slate-900">
            Prospectus URL
          </label>
          <input
            id="prospectusUrl"
            type="url"
            value={form.prospectusUrl}
            onChange={(event) => setField("prospectusUrl", event.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="contactInformation" className="block text-sm font-medium text-slate-900">
            Contact Information
          </label>
          <input
            id="contactInformation"
            type="text"
            value={form.contactInformation}
            onChange={(event) => setField("contactInformation", event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-slate-900">
          Instructions
        </label>
        <textarea
          id="instructions"
          value={form.instructions}
          onChange={(event) => setField("instructions", event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href={`/admin/admissions/requirements?periodId=${encodeURIComponent(
            form.admissionPeriodId
          )}`}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Requirement"}
        </button>
      </div>
    </form>
  );
}
