import type { Metadata } from "next";

import { FacilityCard } from "@/components/cards/facility-card";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { FacilityService } from "@/services/facilities";

export const metadata: Metadata = {
  title: "Campus Facilities - Scholar",
  description:
    "Explore the campus facilities at Scholar — purpose-built classrooms, laboratories and spaces that support learning.",
  alternates: {
    canonical: "/facilities",
  },
  openGraph: {
    title: "Campus Facilities - Scholar",
    description:
      "Explore the campus facilities at Scholar — purpose-built classrooms, laboratories and spaces that support learning.",
    images: [
      {
        url: "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-001.jpg&w=800&h=400&q=80",
        width: 800,
        height: 400,
        alt: "Scholar campus facilities - classroom and lab",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Campus Facilities - Scholar",
    description:
      "Explore the campus facilities at Scholar — purpose-built classrooms, laboratories and spaces that support learning.",
    images: [
      "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-001.jpg&w=800&h=400&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const revalidate = 300;

export default async function FacilitiesPage() {
  const facilities = await new FacilityService().listPublished();

  return (
    <>
      <PageHeader
        eyebrow="Campus"
        title="Facilities That Support Learning"
        description="Purpose-built classrooms, labs and spaces that make learning comfortable, safe and effective."
        crumbs={[{ label: "Campus", href: "/" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          {facilities.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No facilities published yet"
              description="Facilities will appear here once they are published."
            />
          )}
        </Container>
      </section>

      <CtaSection
        title="Visit Our Campus"
        description="Book a guided tour to see our classrooms, laboratories and facilities for yourself."
        primaryLabel="Book a Visit"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
