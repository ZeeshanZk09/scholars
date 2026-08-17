import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { isAppError } from "@/lib/errors";
import { siteConfig } from "@/lib/site-config";
import { ComputerCourseService } from "@/services/computer-courses";

type ComputerCourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const items = await new ComputerCourseService().listPublished({ take: 500 });

  return items.map((course) => ({ slug: course.slug }));
}

const getCourseCached = cache(async (slug: string) => {
  try {
    return await new ComputerCourseService().getPublishedBySlug(slug);
  } catch (error) {
    if (isAppError(error)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: ComputerCourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseCached(slug);

  const description =
    course.shortDescription ??
    course.detailedDescription ??
    `Learn about the ${course.name} course at Scholar Computer Courses.`;

  return {
    title: `${course.name} — Scholar Computer Courses`,
    description,
    alternates: { canonical: `/academics/computer-courses/${course.slug}` },
    openGraph: {
      title: `${course.name} — Scholar Computer Courses`,
      description,
      url: `/academics/computer-courses/${course.slug}`,
    },
  };
}

export default async function ComputerCourseDetailPage({
  params,
}: Readonly<ComputerCourseDetailPageProps>) {
  const { slug } = await params;
  const course = await getCourseCached(slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Computer Courses",
        item: `${siteConfig.url}/computer-courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.name,
        item: `${siteConfig.url}/academics/computer-courses/${course.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <Container className="py-12 sm:py-16">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground"
        >
          <Link href="/computer-courses">
            <ArrowLeft aria-hidden="true" />
            Back to Computer Courses
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl">
          <header className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-navy/70">
              Scholar Computer Courses
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
              {course.name}
            </h1>
          </header>

          {course.shortDescription ? (
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {course.shortDescription}
            </p>
          ) : null}

          {course.detailedDescription ? (
            <div
              className="prose prose-slate mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: course.detailedDescription }}
            />
          ) : null}

          <dl className="mt-8 space-y-6">
            {course.eligibility ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Eligibility</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {course.eligibility}
                </dd>
              </div>
            ) : null}
            {course.duration ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Duration</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {course.duration}
                </dd>
              </div>
            ) : null}
            {course.instructor ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Instructor</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {course.instructor}
                </dd>
              </div>
            ) : null}
            {course.timing ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Timing</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {course.timing}
                </dd>
              </div>
            ) : null}
            {course.fee ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Fee</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {course.fee}
                </dd>
              </div>
            ) : null}
            {course.courseOutline ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Course Outline</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {course.courseOutline}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/admissions/apply">
                Apply for this Course
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </article>
      </Container>
    </>
  );
}
