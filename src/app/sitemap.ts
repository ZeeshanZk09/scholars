import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import { SchoolService } from "@/services/academics";
import { BlogService } from "@/services/blogs";
import { CoachingProgramService } from "@/services/coaching";
import { ComputerCourseService } from "@/services/computer-courses";
import { ProgramService } from "@/services/programs";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
   { path: "/about", priority: 0.7, changeFrequency: "monthly" },
   { path: "/academics", priority: 0.8, changeFrequency: "monthly" },
   { path: "/school", priority: 0.8, changeFrequency: "monthly" },
  { path: "/college", priority: 0.8, changeFrequency: "monthly" },
  { path: "/coaching", priority: 0.8, changeFrequency: "monthly" },
  { path: "/computer-courses", priority: 0.8, changeFrequency: "monthly" },
  { path: "/programs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/admissions", priority: 0.9, changeFrequency: "weekly" },
  { path: "/admissions/apply", priority: 0.9, changeFrequency: "weekly" },
   { path: "/facilities", priority: 0.6, changeFrequency: "monthly" },
   { path: "/faculty", priority: 0.6, changeFrequency: "monthly" },
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

  const schoolClasses = await new SchoolService().listClassesPublished();
  const collegePrograms = await new ProgramService().listPublished({ take: 500 });
  const coachingPrograms = await new CoachingProgramService().listPublished({
    take: 500,
  });
  const computerCourses = await new ComputerCourseService().listPublished({
    take: 500,
  });

  const academicEntries: MetadataRoute.Sitemap = [
    ...schoolClasses.map((schoolClass) => ({
      url: `${baseUrl}/academics/school/${schoolClass.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...collegePrograms.map((program) => ({
      url: `${baseUrl}/academics/college/${program.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...coachingPrograms.map((program) => ({
      url: `${baseUrl}/academics/coaching/${program.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...computerCourses.map((course) => ({
      url: `${baseUrl}/academics/computer-courses/${course.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticEntries, ...academicEntries, ...blogEntries];
}
