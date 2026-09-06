import type { Metadata } from "next";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { TestimonialService } from "@/services/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what parents and students say about their experience of studying and growing at Scholar.",
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    title: "Testimonials - Scholar Educational Community",
    description:
      "Read what parents and students say about their experience of studying and growing at Scholar.",
    images: [
      {
        url: "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-013.jpg&w=800&h=400&q=80",
        width: 800,
        height: 400,
        alt: "Scholar testimonials - parents and students",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Testimonials - Scholar Educational Community",
    description:
      "Read what parents and students say about their experience of studying and growing at Scholar.",
    images: [
      "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-013.jpg&w=800&h=400&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function TestimonialsPage() {
  const testimonials = await new TestimonialService().listPublished();

  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="What Our Community Says"
        description="Parents and students share their experience of studying and growing at Scholar."
        crumbs={[{ label: "Testimonials" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No testimonials yet"
              description="Testimonials will appear here once they are published."
            />
          )}
        </Container>
      </section>

      <CtaSection
        title="Experience Scholar Yourself"
        description="Come and see why our community speaks so highly of Scholar."
        primaryLabel="Book a Visit"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
