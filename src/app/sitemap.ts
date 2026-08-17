import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import { BlogService } from "@/services/blogs";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/school", priority: 0.8, changeFrequency: "monthly" },
  { path: "/college", priority: 0.8, changeFrequency: "monthly" },
  { path: "/coaching", priority: 0.8, changeFrequency: "monthly" },
  { path: "/computer-courses", priority: 0.8, changeFrequency: "monthly" },
  { path: "/programs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/admissions", priority: 0.9, changeFrequency: "weekly" },
  { path: "/admissions/apply", priority: 0.9, changeFrequency: "weekly" },
  { path: "/facilities", priority: 0.6, changeFrequency: "monthly" },
  { path: "/testimonials", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blogs", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const { items: blogs } = await new BlogService().listPublished({
    skip: 0,
    take: 500,
  });

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.publishedAt ?? blog.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
