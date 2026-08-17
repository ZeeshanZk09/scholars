import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

import { BlogCard } from "@/components/cards/blog-card";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { BlogService } from "@/services/blogs";

export const metadata: Metadata = {
  title: "Blogs & Updates",
  description:
    "Insights, updates and stories from the Scholar campus — news, achievements and helpful guidance for students and parents.",
  alternates: {
    canonical: "/blogs",
  },
};

const PAGE_SIZE = 9;

type BlogsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogsPage({
  searchParams,
}: Readonly<BlogsPageProps>) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const { items, total } = await new BlogService().listPublished({
    skip,
    take: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="News & Updates"
        title="Blogs & Updates"
        description="Insights, updates and stories from the Scholar campus."
        crumbs={[{ label: "Blogs" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          {items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No posts published yet"
              description="Blog posts will appear here once they are published."
            />
          )}

          {totalPages > 1 ? (
            <nav
              className="mt-12 flex items-center justify-center gap-4"
              aria-label="Blog pagination"
            >
              {currentPage > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/blogs?page=${currentPage - 1}`}>
                    <ChevronLeft aria-hidden="true" />
                    Previous
                  </Link>
                </Button>
              ) : null}
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              {currentPage < totalPages ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/blogs?page=${currentPage + 1}`}>
                    Next
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </nav>
          ) : null}
        </Container>
      </section>
    </>
  );
}
