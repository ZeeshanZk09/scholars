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
import { ProgramService } from "@/services/programs";

type CollegeProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const items = await new ProgramService().listPublished({ take: 500 });

  return items.map((program) => ({ slug: program.slug }));
}

const getProgramCached = cache(async (slug: string) => {
  try {
    return await new ProgramService().getPublishedBySlug(slug);
  } catch (error) {
    if (isAppError(error)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: CollegeProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramCached(slug);

  const description =
    program.description ??
    `Learn about the ${program.name} program at Scholar College.`;

  return {
    title: `${program.name} — Scholar College`,
    description,
    alternates: { canonical: `/academics/college/${program.slug}` },
    openGraph: {
      title: `${program.name} — Scholar College`,
      description,
      url: `/academics/college/${program.slug}`,
    },
  };
}

export default async function CollegeProgramDetailPage({
  params,
}: Readonly<CollegeProgramDetailPageProps>) {
  const { slug } = await params;
  const program = await getProgramCached(slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "College", item: `${siteConfig.url}/college` },
      {
        "@type": "ListItem",
        position: 3,
        name: program.name,
        item: `${siteConfig.url}/academics/college/${program.slug}`,
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
          <Link href="/college">
            <ArrowLeft aria-hidden="true" />
            Back to College
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl">
          <header className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-navy/70">
              Scholar College
              {program.groupName ? ` · ${program.groupName}` : ""}
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
            {program.subjects ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Subjects</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.subjects}
                </dd>
              </div>
            ) : null}
            {program.eligibility ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Eligibility</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.eligibility}
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
            {program.admissionRequirements ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">
                  Admission Requirements
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {program.admissionRequirements}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/admissions/apply">
                Apply for Admission
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </article>
      </Container>
    </>
  );
}
