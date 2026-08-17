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
import { CoachingProgramService } from "@/services/coaching";

type CoachingProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const items = await new CoachingProgramService().listPublished({ take: 500 });

  return items.map((program) => ({ slug: program.slug }));
}

const getCoachingCached = cache(async (slug: string) => {
  try {
    return await new CoachingProgramService().getPublishedBySlug(slug);
  } catch (error) {
    if (isAppError(error)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: CoachingProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getCoachingCached(slug);

  const description =
    program.description ??
    `Learn about ${program.name} coaching at Scholar Coaching.`;

  return {
    title: `${program.name} — Scholar Coaching`,
    description,
    alternates: { canonical: `/academics/coaching/${program.slug}` },
    openGraph: {
      title: `${program.name} — Scholar Coaching`,
      description,
      url: `/academics/coaching/${program.slug}`,
    },
  };
}

export default async function CoachingProgramDetailPage({
  params,
}: Readonly<CoachingProgramDetailPageProps>) {
  const { slug } = await params;
  const program = await getCoachingCached(slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "Coaching", item: `${siteConfig.url}/coaching` },
      {
        "@type": "ListItem",
        position: 3,
        name: program.name,
        item: `${siteConfig.url}/academics/coaching/${program.slug}`,
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
          <Link href="/coaching">
            <ArrowLeft aria-hidden="true" />
            Back to Coaching
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl">
          <header className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-navy/70">
              Scholar Coaching
              {program.category ? ` · ${program.category}` : ""}
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
              {program.name}
            </h1>
          </header>

          {program.description ? (
            <p className="mt-6 text-base leading-relaxed text-slate-700">
              {program.description}
            </p>
          ) : null}

          <dl className="mt-8 space-y-6">
            {program.targetStudents ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">
                  Target Students
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.targetStudents}
                </dd>
              </div>
            ) : null}
            {program.subjects ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Subjects</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.subjects}
                </dd>
              </div>
            ) : null}
            {program.duration ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Duration</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.duration}
                </dd>
              </div>
            ) : null}
            {program.timing ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Timing</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.timing}
                </dd>
              </div>
            ) : null}
            {program.feeInformation ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Fee Information</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.feeInformation}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/admissions/apply">
                Apply for Coaching
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </article>
      </Container>
    </>
  );
}
