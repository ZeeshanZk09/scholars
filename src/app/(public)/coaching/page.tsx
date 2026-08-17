import type { Metadata } from "next";

import { CoachingCard } from "@/components/cards/coaching-card";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CoachingProgramService } from "@/services/coaching";

export const metadata: Metadata = {
  title: "Scholar Coaching",
  description:
    "Board exam preparation and entry test coaching at Scholar — structured study plans, regular assessments and expert guidance.",
  alternates: {
    canonical: "/coaching",
  },
};

export const revalidate = 300;

const features = [
  "Board exam preparation for Matric and Intermediate",
  "Entry test preparation for medical and engineering",
  "Structured study plans and weekly test series",
  "Doubt-clearing sessions and result feedback",
  "Morning and evening batches for flexibility",
  "Experienced teachers who know the board pattern",
];

export default async function CoachingPage() {
  const programs = await new CoachingProgramService().listPublished();

  return (
    <>
      <PageHeader
        eyebrow="Scholar Coaching"
        title="Scholar Coaching"
        description="Focused board examination and entry test preparation with structured study plans, regular assessments and expert guidance."
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Coaching Programs"
            title="Preparation That Gets Results"
            description="Our coaching programs give students the extra practice, testing and mentoring they need to perform at their best."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.length > 0 ? (
              programs.map((program) => (
                <CoachingCard key={program.id} program={program} />
              ))
            ) : (
              <EmptyState
                className="col-span-full"
                title="No coaching programs yet"
                description="Coaching programs will appear here once they are published."
              />
            )}
          </div>
        </Container>
      </section>

      {/* Classes, subjects & timings */}
      <section className="bg-white">
        <Container className="pb-16 sm:pb-24">
          {programs.length > 0 ? (
            <div className="overflow-hidden rounded-xl border bg-white">
              <div className="border-b bg-surface px-6 py-4">
                <h2 className="text-lg font-semibold text-navy">
                  Classes, Subjects & Timings
                </h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {programs.map((program) => (
                  <li
                    key={program.id}
                    className="grid gap-3 px-6 py-5 sm:grid-cols-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {program.name}
                      </p>
                      {program.category ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {program.category}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Subjects
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {program.subjects ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Timings
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[program.timing, program.duration]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Why Scholar Coaching"
            title="More Than Extra Classes"
            description="We measure progress weekly and adjust study plans so every student stays on track for their target grade."
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 rounded-lg border bg-white p-4 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection
        title="Enrol in Scholar Coaching"
        description="Limited seats per batch. Contact us to schedule an assessment and join the next batch."
        primaryLabel="Apply Now"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
