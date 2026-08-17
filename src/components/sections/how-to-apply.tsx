import { ArrowRight, ClipboardCheck, FileText, Search, Send } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Choose Your Program",
    description:
      "Explore our school classes, college groups, coaching batches or computer courses to find the right fit.",
  },
  {
    icon: FileText,
    title: "Check Eligibility & Dates",
    description:
      "Review the admission requirements, opening dates and required documents for the current session.",
  },
  {
    icon: Send,
    title: "Submit Your Application",
    description:
      "Fill out the online admission form with your details, or visit the campus office for assistance.",
  },
  {
    icon: ClipboardCheck,
    title: "Complete Admission",
    description:
      "Our team confirms your admission and guides you through fee submission and the first day of class.",
  },
];

export function HowToApply() {
  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="How to Apply"
          title="A Simple Path to Admission"
          description="Applying to Scholar takes just a few steps. Here is how it works."
        />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white"
                aria-hidden="true"
              >
                <step.icon className="h-6 w-6" />
              </span>
              <span className="absolute left-12 top-2.5 text-2xl font-bold text-slate-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/admissions">
              View Complete Admission Procedure
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
