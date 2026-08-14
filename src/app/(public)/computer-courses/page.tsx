import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CtaSection } from "@/components/shared/cta-section";
import { ComputerCourseCard } from "@/components/cards/computer-course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ComputerCourseService } from "@/services/computer-courses";

export const metadata: Metadata = {
  title: "Scholar Computer Courses",
  description:
    "Practical, career-focused computer courses at Scholar — web development, graphic design, MS Office and more for students and professionals.",
  alternates: {
    canonical: "/computer-courses",
  },
};

export const revalidate = 300;

const features = [
  "Hands-on training with practical projects",
  "Short, career-focused course durations",
  "Evening and weekend batches available",
  "Certificates on successful completion",
  "For students, graduates and working professionals",
  "Guidance on building a career in IT",
];

export default async function ComputerCoursesPage() {
  const courses = await new ComputerCourseService().listPublished();

  return (
    <>
      <PageHeader
        eyebrow="Scholar Computer Courses"
        title="Scholar Computer Courses"
        description="Practical, career-focused computer courses in modern technologies — designed for students, graduates and working professionals."
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Our Courses"
            title="Build Real, In-Demand Skills"
            description="Short, practical courses that take you from beginner to confident professional in the tools employers actually use."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.length > 0 ? (
              courses.map((course) => (
                <ComputerCourseCard key={course.id} course={course} />
              ))
            ) : (
              <EmptyState
                className="col-span-full"
                title="No computer courses yet"
                description="Computer courses will appear here once they are published."
              />
            )}
          </div>
        </Container>
      </section>

      {/* Course details & outlines */}
      {courses.length > 0 ? (
        <section className="bg-surface">
          <Container className="py-16 sm:py-24">
            <SectionHeader
              eyebrow="Course Details"
              title="What You Will Learn"
              description="Explore the full details of each course — eligibility, schedule, fee and the complete outline."
            />
            <div className="mt-12 space-y-6">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="overflow-hidden rounded-xl border bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2 className="text-lg font-semibold text-navy">{course.name}</h2>
                      {course.instructor ? (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Instructor: {course.instructor}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {course.duration ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {course.duration}
                        </span>
                      ) : null}
                      {course.admissionStatus ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {course.admissionStatus}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid gap-8 px-6 py-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-5">
                      {course.detailedDescription ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {course.detailedDescription}
                        </p>
                      ) : null}
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Course Outline
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                          {course.courseOutline}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 rounded-lg bg-slate-50 p-5 text-sm">
                      {course.eligibility ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Eligibility
                          </p>
                          <p className="mt-1 text-slate-700">{course.eligibility}</p>
                        </div>
                      ) : null}
                      {course.timing ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Schedule
                          </p>
                          <p className="mt-1 text-slate-700">{course.timing}</p>
                        </div>
                      ) : null}
                      {course.fee ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Fee
                          </p>
                          <p className="mt-1 text-slate-700">{course.fee}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Why Learn With Us"
            title="Practical Learning, Career Outcomes"
            description="Every course combines theory with hands-on practice so you finish with projects you can show to employers."
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 rounded-lg border bg-surface p-4 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection
        title="Start Learning Today"
        description="New course batches begin regularly. Contact us for the schedule, fees and registration."
        primaryLabel="Apply Now"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}