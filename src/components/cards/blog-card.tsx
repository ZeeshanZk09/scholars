import { ArrowRight, CalendarDays, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { BlogSafe } from "@/repositories/blogs/blog.repository";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/format";

type BlogCardProps = {
  blog: BlogSafe;
  category?: string;
};

export function BlogCard({ blog, category }: Readonly<BlogCardProps>) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link
        href={`/blogs/${blog.slug}`}
        className="relative block aspect-video w-full overflow-hidden bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={blog.title}
      >
        {blog.featuredImage ? (
          <Image
            src={blog.featuredImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-navy/5 text-navy/40">
            <GraduationCap className="h-10 w-10" aria-hidden="true" />
          </span>
        )}
      </Link>
      <CardHeader className="pb-2">
        {category ? (
          <Badge variant="secondary" className="w-fit">
            {category}
          </Badge>
        ) : blog.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-[0.65rem]">
                #{tag.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={blog.publishedAt?.toISOString()}>
              {formatDateShort(blog.publishedAt ?? blog.createdAt) ?? ""}
            </time>
          </span>
        )}
        <CardTitle className="text-lg leading-snug text-navy">
          <Link
            href={`/blogs/${blog.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {blog.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {blog.excerpt ?? "Read the full article on the Scholar blog."}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read More
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
