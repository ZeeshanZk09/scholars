import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CtaSection } from "@/components/shared/cta-section";
import { AdmissionCard } from "@/components/cards/admission-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissionsService } from "@/services/admissions";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission periods, requirements and application process for Scholar School, College, Coaching and Computer Courses.",
  alternates: {
    canonical: "/admissions",
  },
};

export const revalidate = 300;

const ACTIVE_STATUSES = ["OPEN", "COMING_SOON"] as const;

const steps = [
  {
    title: "Submit Your Application",
    description:
      "Fill in the online application form with the student's details, contact information and the program you are interested in.",
  },
  {
    title: "Submit Documents",
    description:
      "Provide the required documents such as previous result cards, B-form and photographs for verification.",
  },
  {
    title: "Test & Interview",
    description:
      "Attend the admission test or interview where applicable for your chosen program or class.",
  },
  {
    title: "Confirm Your Seat",
    description:
      "Complete the admission by paying the fee after the merit list or committee decision is announced.",
  },
];

export default async function AdmissionsPage() {
  const admissions = new AdmissionsService();
  const periods = await admissions.listPeriods({ skip: 0, take: 50 });

  const activePeriods = periods.items.filter((period) =>
    (ACTIVE_STATUSES as readonly string[]).includes(period.status)
  );

  const featuredPeriod = activePeriods[0] ?? periods.items[0];
  const requirements = featuredPeriod
    ? await admissions.listRequirements(featuredPeriod.id)
    : [];

  const hasActive = activePeriods.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title="Admissions at Scholar"
        description="Find open admission periods, requirements and the steps to join Scholar School, College, Coaching or Computer Courses."
        crumbs={[{ label: "Admissions" }]}
      />

      {/* Open periods */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow={hasActive ? "Open Now" : "Admission Periods"}
            title={
              hasActive
                ? "Open Admission Periods"
                : "Upcoming Admission Periods"
            }
            description={
              "Check the admission periods below for the session, dates and status of each program area."
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {activePeriods.length > 0 ? (
              activePeriods.map((period) => (
                <AdmissionCard key={period.id} period={period} />
              ))
            ) : (
              <EmptyState
                className="col-span-full"
                title="No open admission periods right now"
                description="Admission periods will appear here when announced. Contact us to express your interest."
              />
            )}
          </div>
        </Container>
      </section>

      {/* Requirements */}
      {requirements.length > 0 ? (
        <section className="bg-surface">
          <Container className="py-16 sm:py-24">
            <SectionHeader
              eyebrow="Requirements"
              title="Admission Requirements"
              description={
                featuredPeriod
                  ? `Key requirements for ${featuredPeriod.title} (${featuredPeriod.session.name}).`
                  : undefined
              }
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {requirements.map((requirement) => (
                <Card key={requirement.id}>
                  <CardHeader>
                    <CardTitle className="text-lg text-navy">
                      {requirement.eligibility ?? "Eligibility & Requirements"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {requirement.requiredDocuments ? (
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          Required Documents
                        </h3>
                        <p>{requirement.requiredDocuments}</p>
                      </div>
                    ) : null}
                    {requirement.applicationProcess ? (
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          Application Process
                        </h3>
                        <p>{requirement.applicationProcess}</p>
                      </div>
                    ) : null}
                    {requirement.importantDates ? (
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          Important Dates
                        </h3>
                        <p>{requirement.importantDates}</p>
                      </div>
                    ) : null}
                    {requirement.feeInformation ? (
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          Fee Information
                        </h3>
                        <p>{requirement.feeInformation}</p>
                      </div>
                    ) : null}
                    {requirement.contactInformation ? (
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">
                          Contact
                        </h3>
                        <p>{requirement.contactInformation}</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* How to apply */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="How It Works"
            title="How to Apply"
            description="A simple four-step process to begin your journey at Scholar."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border bg-surface p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Ready to Apply?"
        description="Submit an application today and our admissions team will guide you through the rest."
        primaryLabel="Apply Now"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}