import type { Metadata } from "next";

import { ProgramCard } from "@/components/cards/program-card";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProgramService } from "@/services/programs";

export const metadata: Metadata = {
  title: "Academic Programs - Scholar",
  description:
    "Explore the academic programs at Scholar — Intermediate groups in Pre-Medical, Pre-Engineering, Computer Science and more.",
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Academic Programs - Scholar",
    description:
      "Explore the academic programs at Scholar — Intermediate groups in Pre-Medical, Pre-Engineering, Computer Science and more.",
    images: [
      {
        url: "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-001.jpg&w=800&h=400&q=80",
        width: 800,
        height: 400,
        alt: "Scholar academic programs - classroom learning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Academic Programs - Scholar",
    description:
      "Explore the academic programs at Scholar — Intermediate groups in Pre-Medical, Pre-Engineering, Computer Science and more.",
    images: [
      "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-001.jpg&w=800&h=400&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const revalidate = 300;

export default async function ProgramsPage() {
  const programs = await new ProgramService().listPublished();

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Academic Programs"
        description="From foundational schooling to Intermediate groups in Pre-Medical, Pre-Engineering and Computer Science."
        crumbs={[{ label: "Academics" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          {programs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No programs published yet"
              description="Academic programs will appear here once they are published."
            />
          )}
        </Container>
      </section>

      <CtaSection
        title="Ready to Enrol?"
        description="Contact our admissions office to learn more about program requirements and how to apply."
        primaryLabel="Apply Now"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
