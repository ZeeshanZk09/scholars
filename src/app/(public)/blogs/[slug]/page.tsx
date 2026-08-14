import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft, CalendarDays, GraduationCap, User } from "lucide-react";

import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { isAppError } from "@/lib/errors";
import { siteConfig } from "@/lib/site-config";
import { BlogService } from "@/services/blogs";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const { items } = await new BlogService().listPublished({ skip: 0, take: 500 });

  return items.map((blog) => ({ slug: blog.slug }));
}

const getBlogCached = cache(async (slug: string) => {
  try {
    return await new BlogService().getPublishedBySlug(slug);
  } catch (error) {
    if (isAppError(error)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogCached(slug);
  const seo = blog.seo[0];

  return {
    title: seo?.seoTitle ?? blog.title,
    description: seo?.metaDescription ?? blog.excerpt ?? undefined,
    keywords: seo?.keywords ?? undefined,
    alternates: seo?.canonicalUrl
      ? { canonical: seo.canonicalUrl }
      : { canonical: `/blogs/${blog.slug}` },
    robots: seo?.robots ?? "index, follow",
    openGraph: {
      title: seo?.ogTitle ?? blog.title,
      description: seo?.ogDescription ?? blog.excerpt ?? undefined,
      type: "article",
      url: `/blogs/${blog.slug}`,
      publishedTime: (blog.publishedAt ?? blog.createdAt).toISOString(),
      authors: blog.author?.name ? [blog.author.name] : undefined,
      images: seo?.ogImage
        ? [{ url: seo.ogImage }]
        : blog.featuredImage
          ? [{ url: blog.featuredImage }]
          : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogCached(slug);
  const seo = blog.seo[0];

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: seo?.metaDescription ?? blog.excerpt ?? undefined,
    datePublished: (blog.publishedAt ?? blog.createdAt).toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    image: seo?.ogImage ?? blog.featuredImage ?? undefined,
    author: blog.author?.name
      ? { "@type": "Person", name: blog.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: siteConfig.fullName,
    },
    mainEntityOfPage: `${siteConfig.url}/blogs/${blog.slug}`,
  };

  return (
    <>
      <JsonLd data={blogPostingJsonLd} />
      <Container className="py-12 sm:py-16">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
          <Link href="/blogs">
            <ArrowLeft aria-hidden="true" />
            Back to Blogs
          </Link>
        </Button>

        <article className="mx-auto max-w-3xl">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {blog.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {blog.author?.name ? (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  {blog.author.name}
                </span>
              ) : null}
              {(blog.publishedAt ?? blog.createdAt) ? (
                <time
                  dateTime={(blog.publishedAt ?? blog.createdAt).toISOString()}
                  className="flex items-center gap-1.5"
                >
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {formatDate(blog.publishedAt ?? blog.createdAt)}
                </time>
              ) : null}
            </div>
          </header>

          {blog.featuredImage ? (
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={blog.featuredImage}
                alt=""
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-xl bg-navy/5 text-navy/40">
              <GraduationCap className="h-16 w-16" aria-hidden="true" />
            </div>
          )}

          <div
            className="prose prose-slate mt-10 max-w-none [&_img]:rounded-lg [&_img]:mx-auto"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </Container>
    </>
  );
}