import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { CtaSection } from "@/components/shared/cta-section";
import { FacultyCard } from "@/components/cards/faculty-card";
import { EmptyState } from "@/components/shared/empty-state";
import { FacultyService } from "@/services/faculty";

export const metadata: Metadata = {
  title: "Faculty",
  description: "Meet the dedicated faculty members at Scholar.",
  alternates: {
    canonical: "/faculty",
  },
};

export const revalidate = 300;

export default async function FacultyPage() {
  const { items: faculty } = await new FacultyService().listPublished();

  return (
    <>
      <PageHeader
        eyebrow="Academic"
        title="Our Faculty Members"
        description="Meet the dedicated educators who make learning comfortable, safe and effective."
        crumbs={[{ label: "Academic", href: "/" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          {faculty.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {faculty.map((member) => (
                <FacultyCard key={member.id} faculty={member} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No faculty published yet"
              description="Faculty will appear here once they are published."
            />
          )}
        </Container>
      </section>

      <CtaSection
        title="Join Our Team"
        description="Explore opportunities to become a part of our esteemed faculty."
        primaryLabel="Careers"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
