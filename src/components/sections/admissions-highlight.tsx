import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { HomeAdmissionSummary } from "@/lib/admissions-status";

type AdmissionsHighlightProps = {
  admission: HomeAdmissionSummary;
};

const COPY: Record<
  HomeAdmissionSummary["status"],
  { eyebrow: string; title: string; description: string; dot: string }
> = {
  OPEN: {
    eyebrow: "Admissions Open",
    title: "Admissions Are Now Open",
    description:
      "Begin your journey with Scholar. School, College, Coaching and Computer Course admissions are accepting applications.",
    dot: "bg-emerald-400",
  },
  COMING_SOON: {
    eyebrow: "Admissions Coming Soon",
    title: "Admissions Will Open Soon",
    description:
      "We are preparing for the upcoming academic session. Submit an inquiry and we will keep you informed.",
    dot: "bg-amber-400",
  },
  CLOSED: {
    eyebrow: "Admissions Currently Closed",
    title: "Admissions Are Currently Closed",
    description:
      "New admissions will open for the next session. Contact us to register your interest and be notified.",
    dot: "bg-slate-400",
  },
};

export function AdmissionsHighlight({ admission }: AdmissionsHighlightProps) {
  const copy = COPY[admission.status];

  return (
    <section className="bg-navy text-white">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-semibold">
            <span className={`h-2 w-2 rounded-full ${copy.dot}`} aria-hidden="true" />
            {copy.eyebrow}
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-300">{copy.description}</p>

          {admission.period ? (
            <dl className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-300">
              {admission.period.session ? (
                <div className="flex items-center gap-2">
                  <dt className="font-medium text-slate-400">Session:</dt>
                  <dd className="font-semibold text-white">{admission.period.session.name}</dd>
                </div>
              ) : null}
              {admission.period.openingDate ? (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <dt className="font-medium text-slate-400">Opens:</dt>
                  <dd className="font-semibold text-white">
                    {formatDate(admission.period.openingDate)}
                  </dd>
                </div>
              ) : null}
              {admission.period.closingDate ? (
                <div className="flex items-center gap-2">
                  <dt className="font-medium text-slate-400">Closes:</dt>
                  <dd className="font-semibold text-white">
                    {formatDate(admission.period.closingDate)}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-navy hover:bg-slate-100">
              <Link href="/admissions/apply">
                Apply Now
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link href="/admissions">Admission Details</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
