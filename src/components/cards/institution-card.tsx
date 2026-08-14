import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, GraduationCap, Laptop, School } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, LucideIcon> = {
  school: School,
  college: GraduationCap,
  coaching: BookOpen,
  courses: Laptop,
};

type InstitutionCardProps = {
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  icon?: string;
  ctaLabel?: string;
};

export function InstitutionCard({
  title,
  shortTitle,
  href,
  description,
  icon = "school",
  ctaLabel = "Explore",
}: InstitutionCardProps) {
  const Icon = ICONS[icon] ?? School;

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <CardTitle className="text-lg text-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={href}>
            {ctaLabel} {shortTitle}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}