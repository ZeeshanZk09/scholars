import { ArrowRight, CalendarDays, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { AdmissionsService } from "@/services/admissions";
import { ProgramService } from "@/services/programs";

export const metadata: Metadata = {
  title: "Scholar College",
  description:
    "Intermediate programs in Pre-Medical, Pre-Engineering and Computer Science at Scholar College — guided by experienced faculty.",
  alternates: {
    canonical: "/college",
  },
};

export const revalidate = 300;

export default async function CollegePage() {
  const [programs, periodsResult] = await Promise.all([
    new ProgramService().listPublished(),
    new AdmissionsService().listPeriods({
      skip: 0,
      take: 50,
      category: "COLLEGE",
    }),
  ]);

  const collegePeriod =
    periodsResult.items.find((period) => period.status === "OPEN") ??
    periodsResult.items.find((period) => period.status === "COMING_SOON") ??
    periodsResult.items[0];

  const requirements = collegePeriod
    ? await new AdmissionsService().listRequirements(collegePeriod.id)
    : [];

  const streams = Array.from(
    new Set(
      programs
        .map((program) => program.groupName)
        .filter((name): name is string => Boolean(name)),
    ),
  );

  return (
    <>
      <PageHeader
        eyebrow="Scholar College"
        title="Scholar College"
        description="Two-year intermediate programs in Pre-Medical, Pre-Engineering, Computer Science and Commerce, guided by experienced faculty and a results-focused approach."
        crumbs={[{ label: "College" }]}
      />

      {/* Academic streams */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Academic Streams"
            title="Choose Your Academic Stream"
            description="Each stream follows the official board syllabus with structured preparation for the final examination."
          />
          {streams.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {streams.map((stream) => {
                const count = programs.filter(
                  (program) => program.groupName === stream,
                ).length;
                return (
                  <div
                    key={stream}
                    className="rounded-lg border bg-surface p-6"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
                      <Layers className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-navy">
                      {stream}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {count} {count === 1 ? "program" : "programs"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              title="Programs coming soon"
              description="College streams and programs will appear here once published."
            />
          )}
        </Container>
      </section>

      {/* Programs & course details */}
      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Programs"
            title="Intermediate Programs & Course Details"
            description="Explore the programs we offer, including subjects, duration and eligibility."
          />
          {programs.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="rounded-lg border bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap
                        className="h-5 w-5 text-navy"
                        aria-hidden="true"
                      />
                      <h3 className="text-lg font-semibold text-navy">
                        {program.name}
                      </h3>
                    </div>
                    {program.groupName ? (
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {program.groupName}
                      </span>
                    ) : null}
                  </div>
                  {program.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {program.description}
                    </p>
                  ) : null}
                  <dl className="mt-4 space-y-2 text-sm">
                    {program.duration ? (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0 font-medium text-slate-800">
                          Duration
                        </dt>
                        <dd className="text-muted-foreground">
                          {program.duration}
                        </dd>
                      </div>
                    ) : null}
                    {program.subjects ? (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0 font-medium text-slate-800">
                          Subjects
                        </dt>
                        <dd className="text-muted-foreground">
                          {program.subjects}
                        </dd>
                      </div>
                    ) : null}
                    {program.eligibility ? (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0 font-medium text-slate-800">
                          Eligibility
                        </dt>
                        <dd className="text-muted-foreground">
                          {program.eligibility}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              title="No programs published yet"
              description="College programs will appear here once published."
            />
          )}
        </Container>
      </section>

      {/* Admission information */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Admissions"
            title="College Admission Information"
            description={
              collegePeriod
                ? `Admissions for ${collegePeriod.session.name} at Scholar College.`
                : "Admission details for Scholar College."
            }
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {collegePeriod ? (
              <div className="rounded-xl border bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-navy">
                    {collegePeriod.title}
                  </h3>
                  <StatusBadge status={collegePeriod.status} />
                </div>
                {collegePeriod.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {collegePeriod.description}
                  </p>
                ) : null}
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <dt className="text-slate-600">Session</dt>
                    <dd className="font-medium text-slate-900">
                      {collegePeriod.session.name}
                    </dd>
                  </div>
                  {collegePeriod.openingDate ? (
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                      <dt className="flex items-center gap-2 text-slate-600">
                        <CalendarDays className="h-4 w-4" aria-hidden="true" />
                        Opens
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {formatDate(collegePeriod.openingDate)}
                      </dd>
                    </div>
                  ) : null}
                  {collegePeriod.closingDate ? (
                    <div className="flex items-center justify-between gap-4 pb-3">
                      <dt className="text-slate-600">Closes</dt>
                      <dd className="font-medium text-slate-900">
                        {formatDate(collegePeriod.closingDate)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/admissions/apply">
                      Apply for Admission
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admissions">All Admissions</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                className="lg:col-span-1"
                title="No admission period announced"
                description="College admission details will appear here when announced. Contact us to register your interest."
              />
            )}

            {requirements.length > 0 ? (
              <div className="rounded-xl border bg-white p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-navy">
                  Eligibility & Requirements
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {requirements.map((requirement) => (
                    <div key={requirement.id} className="space-y-3">
                      {requirement.eligibility ? (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Eligibility:
                          </span>{" "}
                          {requirement.eligibility}
                        </p>
                      ) : null}
                      {requirement.requiredDocuments ? (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Documents:
                          </span>{" "}
                          {requirement.requiredDocuments}
                        </p>
                      ) : null}
                      {requirement.applicationProcess ? (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Process:
                          </span>{" "}
                          {requirement.applicationProcess}
                        </p>
                      ) : null}
                      {requirement.importantDates ? (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Dates:
                          </span>{" "}
                          {requirement.importantDates}
                        </p>
                      ) : null}
                      {requirement.feeInformation ? (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Fee:
                          </span>{" "}
                          {requirement.feeInformation}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Begin Your Intermediate Journey"
        description="Admissions are open for the upcoming session. Apply today to secure your seat in your preferred group."
        primaryLabel="Apply Now"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
