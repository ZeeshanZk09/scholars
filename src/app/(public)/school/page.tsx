import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, ListChecks, Layers } from "lucide-react";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CtaSection } from "@/components/shared/cta-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FacilityCard } from "@/components/cards/facility-card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { SchoolService } from "@/services/academics";
import { AdmissionsService } from "@/services/admissions";
import { FacilityService } from "@/services/facilities";

export const metadata: Metadata = {
  title: "Scholar Higher Secondary School",
  description:
    "A strong academic foundation from Nursery to Secondary — with values, discipline and holistic growth at Scholar Higher Secondary School.",
  alternates: {
    canonical: "/school",
  },
};

export const revalidate = 300;

export default async function SchoolPage() {
  const [levels, classes, periodsResult, facilities] = await Promise.all([
    new SchoolService().listLevelsPublished(),
    new SchoolService().listClassesPublished(),
    new AdmissionsService().listPeriods({ skip: 0, take: 50, category: "SCHOOL" }),
    new FacilityService().listPublished(),
  ]);

  const schoolPeriod =
    periodsResult.items.find((period) => period.status === "OPEN") ??
    periodsResult.items.find((period) => period.status === "COMING_SOON") ??
    periodsResult.items[0];

  const requirements = schoolPeriod
    ? await new AdmissionsService().listRequirements(schoolPeriod.id)
    : [];

  const orderedClasses = [...classes].sort((a, b) => a.displayOrder - b.displayOrder);
  const gradeRange =
    orderedClasses.length > 1
      ? `${orderedClasses[0]?.name ?? "—"} to ${orderedClasses.at(-1)?.name ?? "—"}`
      : (orderedClasses[0]?.name ?? "—");

  return (
    <>
      <PageHeader
        eyebrow="Scholar School"
        title="Scholar Higher Secondary School"
        description="A strong academic foundation from Nursery to Secondary — with a focus on values, discipline and holistic growth."
        crumbs={[{ label: "School" }]}
      />

      {/* Curriculum stages */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Curriculum"
            title="Learning Stages Designed for Growth"
            description="Our school curriculum follows a clear path from early learning to board examination readiness."
          />
          {levels.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levels.map((level) => (
                <div key={level.id} className="rounded-lg border bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                      <Layers className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-navy">{level.name}</h3>
                  </div>
                  {level.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {level.description}
                    </p>
                  ) : null}
                  {level.classes.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {level.classes.map((schoolClass) => (
                        <li
                          key={schoolClass.id}
                          className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {schoolClass.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              title="Curriculum coming soon"
              description="School stages and classes will appear here once published."
            />
          )}
        </Container>
      </section>

      {/* Classes */}
      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Classes"
            title="Every Class, Every Stage"
            description="From the first steps in Nursery to the final year of Matric, each class is structured for steady progress."
          />
          {classes.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {orderedClasses.map((schoolClass) => (
                <div key={schoolClass.id} className="rounded-lg border bg-white p-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-navy" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-navy">{schoolClass.name}</h3>
                  </div>
                  {schoolClass.eligibility ? (
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-800">Eligibility:</span>{" "}
                      {schoolClass.eligibility}
                    </p>
                  ) : null}
                  {schoolClass.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {schoolClass.description}
                    </p>
                  ) : null}
                  {schoolClass.learningOutcomes ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-slate-800">Outcomes:</span>{" "}
                      {schoolClass.learningOutcomes}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              title="No classes published yet"
              description="Class details will appear here once published."
            />
          )}
        </Container>
      </section>

      {/* Academic information at a glance */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Academic Information"
            title="Scholar School at a Glance"
            description="A snapshot of our school academic structure."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-navy p-8 text-white">
              <Layers className="h-6 w-6 text-slate-300" aria-hidden="true" />
              <p className="mt-4 text-3xl font-bold">{levels.length}</p>
              <p className="mt-1 text-sm font-medium text-slate-300">Academic Stages</p>
            </div>
            <div className="rounded-xl bg-navy p-8 text-white">
              <ListChecks className="h-6 w-6 text-slate-300" aria-hidden="true" />
              <p className="mt-4 text-3xl font-bold">{classes.length}</p>
              <p className="mt-1 text-sm font-medium text-slate-300">Classes Offered</p>
            </div>
            <div className="rounded-xl bg-navy p-8 text-white">
              <GraduationCap className="h-6 w-6 text-slate-300" aria-hidden="true" />
              <p className="mt-4 text-3xl font-bold">{gradeRange}</p>
              <p className="mt-1 text-sm font-medium text-slate-300">Grade Range</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Admission information */}
      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Admissions"
            title="School Admission Information"
            description={
              schoolPeriod
                ? `Admissions for ${schoolPeriod.session.name} at Scholar School.`
                : "Admission details for Scholar School."
            }
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {schoolPeriod ? (
              <div className="rounded-xl border bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-navy">{schoolPeriod.title}</h3>
                  <StatusBadge status={schoolPeriod.status} />
                </div>
                {schoolPeriod.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {schoolPeriod.description}
                  </p>
                ) : null}
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <dt className="text-slate-600">Session</dt>
                    <dd className="font-medium text-slate-900">{schoolPeriod.session.name}</dd>
                  </div>
                  {schoolPeriod.openingDate ? (
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                      <dt className="flex items-center gap-2 text-slate-600">
                        <CalendarDays className="h-4 w-4" aria-hidden="true" />
                        Opens
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {formatDate(schoolPeriod.openingDate)}
                      </dd>
                    </div>
                  ) : null}
                  {schoolPeriod.closingDate ? (
                    <div className="flex items-center justify-between gap-4 pb-3">
                      <dt className="text-slate-600">Closes</dt>
                      <dd className="font-medium text-slate-900">
                        {formatDate(schoolPeriod.closingDate)}
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
                description="School admission details will appear here when announced. Contact us to register your interest."
              />
            )}

            {requirements.length > 0 ? (
              <div className="rounded-xl border bg-white p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-navy">Requirements & Documents</h3>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {requirements.map((requirement) => (
                    <div key={requirement.id} className="space-y-3">
                      {requirement.eligibility ? (
                        <p>
                          <span className="font-semibold text-slate-900">Eligibility:</span>{" "}
                          {requirement.eligibility}
                        </p>
                      ) : null}
                      {requirement.requiredDocuments ? (
                        <p>
                          <span className="font-semibold text-slate-900">Documents:</span>{" "}
                          {requirement.requiredDocuments}
                        </p>
                      ) : null}
                      {requirement.applicationProcess ? (
                        <p>
                          <span className="font-semibold text-slate-900">Process:</span>{" "}
                          {requirement.applicationProcess}
                        </p>
                      ) : null}
                      {requirement.feeInformation ? (
                        <p>
                          <span className="font-semibold text-slate-900">Fee:</span>{" "}
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

      {/* Facilities */}
      {facilities.length > 0 ? (
        <section className="bg-white">
          <Container className="py-16 sm:py-24">
            <SectionHeader
              eyebrow="Facilities"
              title="School Facilities"
              description="Purpose-built spaces that support learning and healthy development."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.slice(0, 6).map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/facilities">
                  Explore All Facilities
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      <CtaSection
        title="Admissions Open at Scholar School"
        description="Secure a seat for the upcoming session. Contact our office for fee details, transport and class availability."
        primaryLabel="Apply Now"
        secondaryLabel="Talk to Us"
        secondaryHref="/contact"
      />
    </>
  );
}
