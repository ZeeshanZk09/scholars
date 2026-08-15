import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Award, BookOpenCheck, ShieldCheck, Users } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { CtaSection } from "@/components/shared/cta-section";
import { QuickLinksBar } from "@/components/sections/quick-links-bar";
import { InstitutionIntro } from "@/components/sections/institution-intro";
import { AdmissionsHighlight } from "@/components/sections/admissions-highlight";
import { HowToApply } from "@/components/sections/how-to-apply";
import { CoachingCoursesPromo } from "@/components/sections/coaching-courses-promo";
import { ContactVisit } from "@/components/sections/contact-visit";
import { InstitutionCard } from "@/components/cards/institution-card";
import { ProgramCard } from "@/components/cards/program-card";
import { FacilityCard } from "@/components/cards/facility-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { BlogCard } from "@/components/cards/blog-card";
import { Button } from "@/components/ui/button";
import { institutions } from "@/lib/site-config";
import { getHomeAdmissionSummary } from "@/lib/admissions-status";
import { BannerService } from "@/services/banners";
import { ProgramService } from "@/services/programs";
import { FacilityService } from "@/services/facilities";
import { TestimonialService } from "@/services/testimonials";
import { BlogService } from "@/services/blogs";
import { AdmissionsService } from "@/services/admissions";
import { CoachingProgramService } from "@/services/coaching";
import { ComputerCourseService } from "@/services/computer-courses";

const HeroCarousel = dynamic(() =>
  import("@/components/sections/hero-carousel").then((mod) => mod.HeroCarousel)
);

export const metadata: Metadata = {
  title: "Scholar Higher Secondary School, College, Coaching & Computer Courses",
  description:
    "Welcome to Scholar — a complete educational campus offering school, college, coaching and professional computer courses in one place.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 300;

const whyUs = [
  {
    icon: ShieldCheck,
    title: "Safe & Disciplined Campus",
    description:
      "A secure, well-managed environment with trained staff and clear conduct policies.",
  },
  {
    icon: Users,
    title: "Dedicated Faculty",
    description: "Qualified and experienced teachers committed to every student's progress.",
  },
  {
    icon: BookOpenCheck,
    title: "Structured Academics",
    description: "Clear syllabi, regular assessments and focused preparation for board exams.",
  },
  {
    icon: Award,
    title: "Character & Confidence",
    description: "Co-curricular activities and mentorship build leadership and strong values.",
  },
];

export default async function HomePage() {
  const [
    banners,
    programs,
    facilities,
    testimonials,
    blogResult,
    periods,
    coaching,
    computerCourses,
  ] = await Promise.all([
    new BannerService().listPublished(),
    new ProgramService().listPublished({ take: 4 }),
    new FacilityService().listPublished({ take: 6 }),
    new TestimonialService().listPublished({ take: 6 }),
    new BlogService().listPublished({ skip: 0, take: 3 }),
    new AdmissionsService().listPeriods({ skip: 0, take: 50 }).then((result) => result.items),
    new CoachingProgramService().listPublished({ take: 1 }),
    new ComputerCourseService().listPublished({ take: 1 }),
  ]);

  const admission = getHomeAdmissionSummary(periods);

  return (
    <>
      <HeroCarousel banners={banners} />

      <QuickLinksBar admission={admission} />

      {/* Institution introduction */}
      <InstitutionIntro />

      {/* School / College / Coaching / Computer Courses */}
      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Our Divisions"
            title="One Campus, Four Paths to Success"
            description="Scholar combines a higher secondary school, an intermediate college, exam coaching and professional computer courses under one roof — so students can grow with a single trusted institution."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {institutions.map((institution) => (
              <InstitutionCard
                key={institution.href}
                {...institution}
                icon={institution.href.replace("/", "")}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Academic programs */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Academics"
            title="Academic Programs"
            description="From foundational schooling to Intermediate groups in Pre-Medical, Pre-Engineering and Computer Science."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {programs.slice(0, 4).map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                ctaLabel="Admissions"
                ctaHref="/admissions"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/programs">
                View All Programs
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Admissions CTA */}
      <AdmissionsHighlight admission={admission} />

      {/* How to apply */}
      <HowToApply />

      {/* Facilities */}
      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Campus"
            title="Facilities That Support Learning"
            description="Purpose-built classrooms, labs and spaces that make learning comfortable and effective."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.slice(0, 6).map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/facilities">
                Explore Facilities
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Why choose Scholar */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Why Choose Scholar"
            title="An Education Built on Values"
            description="Everything we do is designed to help students learn well, behave well and succeed confidently."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <div key={item.title} className="space-y-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Coaching & Computer courses highlight */}
      <CoachingCoursesPromo coaching={coaching} computerCourses={computerCourses} />

      {/* Testimonials */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Testimonials"
            title="What Our Community Says"
            description="Parents and students share their experience of studying and growing at Scholar."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/testimonials">
                Read More Stories
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Latest blogs */}
      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="News & Updates"
            title="Latest From the Blog"
            description="Insights, updates and stories from the Scholar campus."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogResult.items.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/blogs">
                View All Posts
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Contact / Visit */}
      <ContactVisit />

      <CtaSection
        title="Begin Your Journey at Scholar"
        description="Admissions are open for the upcoming academic session. Contact us to book a visit or submit your application today."
        primaryLabel="Apply Now"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
