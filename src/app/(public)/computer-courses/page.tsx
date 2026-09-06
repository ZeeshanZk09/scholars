import { MapPin, Megaphone, Phone, Rocket, UsersRound } from "lucide-react";
import { type Metadata } from "next";

import type { ComputerCoursePublic } from "@/repositories/computer-courses/computer-course.repository";

import { ComputerCourseCard } from "@/components/cards/computer-course-card";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { getSiteSettings } from "@/lib/site-settings";
import { ComputerCourseService } from "@/services/computer-courses";

export const metadata: Metadata = {
  title: "Scholar Computer Courses - IT & Technology Training",
  description:
    "Practical, career-focused computer courses at Scholar — web development, graphic design, MS Office and more for students and professionals.",
  alternates: {
    canonical: "/computer-courses",
  },
  openGraph: {
    title: "Scholar Computer Courses - IT & Technology Training",
    description:
      "Practical, career-focused computer courses at Scholar — web development, graphic design, MS Office and more for students and professionals.",
    images: [
      {
        url: "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-001.jpg&w=800&h=400&q=80",
        width: 800,
        height: 400,
        alt: "Scholar computer course - student learning technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Scholar Computer Courses - IT & Technology Training",
    description:
      "Practical, career-focused computer courses at Scholar — web development, graphic design, MS Office and more for students and professionals.",
    images: [
      "https://scholars.zebotix.com/_next/image?url=%2Fscholars-schools-official-images%2F01-classroom-activities%2Fclassroom-activity-001.jpg&w=800&h=400&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
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

function CourseTrack({
  courses,
  description,
  title,
}: Readonly<{
  courses: ComputerCoursePublic[];
  description: string;
  title: string;
}>) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200 bg-white">
      <Container className="py-14 sm:py-20">
        <SectionHeader eyebrow="Professional Courses" title={title} description={description} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <ComputerCourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default async function ComputerCoursesPage() {
  const courses = await new ComputerCourseService().listPublished();
  const longCourses = courses.filter((course) => course.duration === "1 Year");
  const shortCourses = courses.filter((course) => course.duration === "6 Months");
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="Professional Courses For A Better Future"
        title="Learn. Build. Succeed."
        description="Job-ready computer courses in full-stack development, programming and modern web technologies, with flexible payment plans and separate girls and boys classes."
      />

      <section className="bg-navy text-white">
        <Container className="grid gap-8 py-10 sm:grid-cols-[1.4fr_1fr] sm:items-center sm:py-14">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-300">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Limited seats are available
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Turn your interest in technology into a successful career.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Learn through practical projects, build a professional portfolio and get the skills
              needed to earn online or enter the technology industry.
            </p>
          </div>
          <div className="grid gap-3 sm:justify-self-end">
            <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-4">
              <Rocket className="h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <span className="text-sm font-medium">Job-ready practical training</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-4">
              <UsersRound className="h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <span className="text-sm font-medium">Separate classes for girls and boys</span>
            </div>
          </div>
        </Container>
      </section>

      {courses.length > 0 ? (
        <>
          <CourseTrack
            courses={longCourses}
            title="Long Courses - 1 Year"
            description="Build a complete foundation for a professional software career through intensive, project-based training."
          />
          <CourseTrack
            courses={shortCourses}
            title="Short Courses - 6 Months"
            description="Choose a focused technology track and start building useful skills in a shorter, career-focused program."
          />
        </>
      ) : (
        <section className="bg-white">
          <Container className="py-16 sm:py-24">
            <EmptyState
              title="No computer courses yet"
              description="Computer courses will appear here once they are published."
            />
          </Container>
        </section>
      )}

      <section className="bg-surface">
        <Container className="py-14 sm:py-20">
          <SectionHeader
            eyebrow="Simple Fee Structure"
            title="Choose The Payment Plan That Works For You"
            description="Every course offers monthly, 50% and full-payment options. Contact the office for registration and the latest batch availability."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            {[
              {
                label: "Long courses",
                value: "PKR 4,000 / month",
                note: "50%: PKR 3,750 · Full: PKR 3,500",
              },
              {
                label: "Short courses",
                value: "PKR 3,500 / month",
                note: "50%: PKR 3,250 · Full: PKR 3,000",
              },
            ].map((plan) => (
              <div
                key={plan.label}
                className="rounded-xl border border-navy/10 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-navy/70">
                  {plan.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-navy">{plan.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{plan.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid gap-6 py-14 sm:grid-cols-2 sm:py-20">
          <div className="rounded-xl bg-navy p-6 text-white sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
              Class timings
            </p>
            <h2 className="mt-2 text-2xl font-bold">A schedule that respects your routine.</h2>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <p>
                <strong className="text-white">Girls classes:</strong> 03:00 PM to 06:00 PM
              </p>
              <p>
                <strong className="text-white">Boys classes:</strong> 06:00 PM to 09:00 PM
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-navy/70">
              Visit or call us
            </p>
            <h2 className="mt-2 text-2xl font-bold text-navy">Start your technology journey.</h2>
            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {settings.address}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <a
                  className="font-semibold text-navy hover:underline"
                  href={`tel:${settings.phoneHref}`}
                >
                  {settings.phone}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>

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
