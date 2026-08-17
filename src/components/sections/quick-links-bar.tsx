import { ArrowRight, BookOpen, ClipboardList, GraduationCap, Laptop } from "lucide-react";
import Link from "next/link";

import type { HomeAdmissionSummary } from "@/lib/admissions-status";

import { Container } from "@/components/layout/container";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuickLink = {
  href: string;
  title: string;
  description: string;
  icon: typeof ClipboardList;
  badge?: string;
};

type QuickLinksBarProps = {
  admission: HomeAdmissionSummary;
};

export function QuickLinksBar({ admission }: QuickLinksBarProps) {
  const links: QuickLink[] = [
    {
      href: "/admissions",
      title: "Admissions",
      description:
        admission.status === "OPEN"
          ? "Admissions are currently open. Check dates and apply."
          : admission.status === "COMING_SOON"
            ? "Admissions open soon. Get ready to apply."
            : "Check admission periods and requirements.",
      icon: ClipboardList,
      badge: admission.status,
    },
    {
      href: "/programs",
      title: "Academic Programs",
      description:
        "Intermediate programs in Pre-Medical, Pre-Engineering, Computer Science and more.",
      icon: BookOpen,
    },
    {
      href: "/coaching",
      title: "Coaching",
      description: "Board exam preparation and entry test coaching with regular assessments.",
      icon: GraduationCap,
    },
    {
      href: "/computer-courses",
      title: "Computer Courses",
      description: "Practical, career-focused courses in modern digital skills.",
      icon: Laptop,
    },
  ];

  return (
    <section className="border-b bg-white">
      <Container className="py-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="flex h-full w-full flex-col transition-shadow hover:shadow-md">
                <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                    <link.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="flex-1 text-base text-navy">{link.title}</CardTitle>
                  {link.badge ? <StatusBadge status={link.badge} /> : null}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col pb-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {link.description}
                  </p>
                  <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Learn More
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
