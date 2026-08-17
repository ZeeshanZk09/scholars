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
import { SchoolService } from "@/services/academics";

type SchoolClassDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const items = await new SchoolService().listClassesPublished();

  return items.map((schoolClass) => ({ slug: schoolClass.slug }));
}

const getSchoolClassCached = cache(async (slug: string) => {
  try {
    return await new SchoolService().getPublishedBySlug(slug);
  } catch (error) {
    if (isAppError(error)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: SchoolClassDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const schoolClass = await getSchoolClassCached(slug);

  const description =
    schoolClass.description ??
    `Learn about the ${schoolClass.name} class at Scholar School.`;

  return {
    title: `${schoolClass.name} — Scholar School`,
    description,
    alternates: { canonical: `/academics/school/${schoolClass.slug}` },
    openGraph: {
      title: `${schoolClass.name} — Scholar School`,
      description,
      url: `/academics/school/${schoolClass.slug}`,
    },
  };
}

export default async function SchoolClassDetailPage({
  params,
}: Readonly<SchoolClassDetailPageProps>) {
  const { slug } = await params;
  const schoolClass = await getSchoolClassCached(slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "School", item: `${siteConfig.url}/school` },
      {
        "@type": "ListItem",
        position: 3,
        name: schoolClass.name,
        item: `${siteConfig.url}/academics/school/${schoolClass.slug}`,
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
          <Link href="/school">
            <ArrowLeft aria-hidden="true" />
            Back to School
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl">
          <header className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-navy/70">
              Scholar School
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
              {schoolClass.name}
            </h1>
          </header>

          {schoolClass.description ? (
            <p className="mt-6 text-base leading-relaxed text-slate-700">
              {schoolClass.description}
            </p>
          ) : null}

          <dl className="mt-8 space-y-6">
            {schoolClass.eligibility ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">Eligibility</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {schoolClass.eligibility}
                </dd>
              </div>
            ) : null}
            {schoolClass.learningOutcomes ? (
              <div>
                <dt className="text-sm font-semibold text-slate-900">
                  Learning Outcomes
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {schoolClass.learningOutcomes}
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
