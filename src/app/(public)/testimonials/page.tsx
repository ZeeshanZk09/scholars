import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { CtaSection } from "@/components/shared/cta-section";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { EmptyState } from "@/components/shared/empty-state";
import { TestimonialService } from "@/services/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what parents and students say about their experience of studying and growing at Scholar.",
  alternates: {
    canonical: "/testimonials",
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
