import type { AdmissionPeriodRecord } from "@/repositories/admissions";

export type HomeAdmissionStatus = "OPEN" | "COMING_SOON" | "CLOSED";

export type HomeAdmissionSummary = {
  status: HomeAdmissionStatus;
  period: AdmissionPeriodRecord | null;
};

export function getHomeAdmissionSummary(periods: AdmissionPeriodRecord[]): HomeAdmissionSummary {
  const open = periods.find((period) => period.status === "OPEN");
  if (open) {
    return { status: "OPEN", period: open };
  }

  const comingSoon = periods.find((period) => period.status === "COMING_SOON");
  if (comingSoon) {
    return { status: "COMING_SOON", period: comingSoon };
  }

  return { status: "CLOSED", period: null };
}
