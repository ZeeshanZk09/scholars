import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CtaSection } from "@/components/shared/cta-section";
import { institutions } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Scholar",
  description:
    "Learn about Scholar Higher Secondary School, College, Coaching and Computer Courses — our mission, values and complete educational journey.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    title: "Academic Excellence",
    description:
      "We set high standards and give every student the support needed to meet them — from clear lessons to focused exam preparation.",
  },
  {
    title: "Character First",
    description:
      "Discipline, honesty and respect are part of everyday campus life, shaping students into responsible individuals.",
  },
  {
    title: "Caring Environment",
    description:
      "Teachers know their students by name and by need, creating a safe place where every learner feels valued.",
  },
  {
    title: "Opportunity for All",
    description:
      "Affordable quality education and support for students at every stage, from early schooling to professional skills.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="One Institution, a Complete Educational Journey"
        description="Scholar brings together a school, a college, exam coaching and computer courses on one campus — so students can continue their education with us from the first day of school to professional skill training."
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            align="left"
            eyebrow="Our Mission"
            title="Excellence in Education, Character, and Opportunity"
            description="Our mission is to provide a complete, well-rounded education that develops strong minds, good character and real skills — preparing students for board examinations, higher education and the professional world."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {institutions.map((institution) => (
              <div
                key={institution.href}
                className="rounded-lg border bg-surface p-6"
              >
                <h3 className="text-lg font-semibold text-navy">
                  {institution.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {institution.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Our Values"
            title="What We Stand For"
            description="These principles guide how we teach, how we behave and how we run our campus every day."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-lg border bg-white p-6">
                <h3 className="text-lg font-semibold text-navy">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Experience Scholar Firsthand"
        description="Visit our campus, meet our faculty and see how we support every student's success."
        primaryLabel="Book a Visit"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}