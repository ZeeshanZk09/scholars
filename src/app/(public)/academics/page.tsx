import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Monitor,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { SchoolService } from "@/services/academics";
import { CoachingProgramService } from "@/services/coaching";
import { ComputerCourseService } from "@/services/computer-courses";
import { ProgramService } from "@/services/programs";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Explore the full academic journey at Scholar — Higher Secondary School, Intermediate College, Exam Coaching and Professional Computer Courses under one roof.",
  alternates: {
    canonical: "/academics",
  },
};

export const revalidate = 300;

const DIVISIONS = [
  {
    key: "school",
    label: "Scholar School",
    href: "/school",
    icon: GraduationCap,
    description:
      "A caring, discipline-focused school from Nursery to Matric with a clear path to board success.",
  },
  {
    key: "college",
    label: "Scholar College",
    href: "/college",
    icon: BookOpen,
    description:
      "Intermediate programs in Pre-Medical, Pre-Engineering, Computer Science and Commerce.",
  },
  {
    key: "coaching",
    label: "Scholar Coaching",
    href: "/coaching",
    icon: Layers,
    description:
      "Focused board-exam and entry-test preparation for school and college students.",
  },
  {
    key: "computer-courses",
    label: "Computer Courses",
    href: "/computer-courses",
    icon: Monitor,
    description:
      "Job-ready professional courses in web development, graphic design and office productivity.",
  },
] as const;

export default async function AcademicsPage() {
  const [levels, collegePrograms, coachingPrograms, computerCourses] =
    await Promise.all([
      new SchoolService().listLevelsPublished(),
      new ProgramService().listPublished(),
      new CoachingProgramService().listPublished(),
      new ComputerCourseService().listPublished(),
    ]);

  const counts: Record<(typeof DIVISIONS)[number]["key"], number> = {
    school: levels.reduce((total, level) => total + level.classes.length, 0),
    college: collegePrograms.length,
    coaching: coachingPrograms.length,
    "computer-courses": computerCourses.length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="One Institution, Every Stage of Learning"
        description="Scholar brings a Higher Secondary School, Intermediate College, Exam Coaching and Professional Computer Courses together — so students can grow with a single trusted institution."
        crumbs={[{ label: "Academics" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Academic Divisions"
            title="Explore Our Academic Pathway"
            description="Each division has its own dedicated programs, faculty and admission process — choose the stage that fits your goals."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {DIVISIONS.map((division) => {
              const Icon = division.icon;
              const count = counts[division.key];

              return (
                <div
                  key={division.key}
                  className="flex flex-col rounded-xl border bg-surface p-6 transition-colors hover:border-navy sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-navy">
                        {division.label}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {count} {count === 1 ? "program" : "programs"} published
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {division.description}
                  </p>
                  <Button asChild variant="outline" className="mt-6 self-start">
                    <Link href={division.href}>
                      Explore {division.label.replace("Scholar ", "")}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Find the Right Program for You"
        description="Whether you are starting school, entering college, preparing for exams or building a career skill — Scholar has a place for you."
        primaryLabel="Apply Now"
        primaryHref="/admissions/apply"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
