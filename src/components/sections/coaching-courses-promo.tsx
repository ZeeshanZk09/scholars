import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import type { CoachingProgramPublic } from "@/repositories/coaching";
import type { ComputerCoursePublic } from "@/repositories/computer-courses";

type CoachingCoursesPromoProps = {
  coaching: CoachingProgramPublic[];
  computerCourses: ComputerCoursePublic[];
};

export function CoachingCoursesPromo({
  coaching,
  computerCourses,
}: CoachingCoursesPromoProps) {
  const featuredCoaching = coaching[0];
  const featuredCourse = computerCourses[0];

  return (
    <section className="bg-surface">
      <Container className="py-16 sm:py-24">
        <SectionHeader
          eyebrow="Beyond the Classroom"
          title="Coaching & Computer Courses"
          description="Developed for students who want extra preparation for board exams and practical digital skills for the future."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Link
            href="/coaching"
            className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/pexels-tima-miroshnichenko-5427868.jpg"
                alt="Students studying in a Scholar coaching class"
                width={1280}
                height={720}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-navy">
                Scholar Coaching
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {featuredCoaching
                  ? `Featured program: ${featuredCoaching.name}.`
                  : "Board exam preparation and entry test coaching with structured study plans and regular assessments."}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Explore Coaching Programs
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>

          <Link
            href="/computer-courses"
            className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/pexels-pavel-danilyuk-8423043.jpg"
                alt="Students learning computer skills in a Scholar computer course"
                width={1280}
                height={720}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-navy">
                Scholar Computer Courses
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {featuredCourse
                  ? `Featured course: ${featuredCourse.name}.`
                  : "Practical, career-focused courses in modern technologies for students and professionals."}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Browse Computer Courses
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/admissions">
              Enroll Now
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}