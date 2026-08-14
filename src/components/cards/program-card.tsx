import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProgramPublic } from "@/repositories/programs/program.repository";

type ProgramCardProps = {
  program: ProgramPublic;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ProgramCard({
  program,
  ctaLabel = "Apply Now",
  ctaHref = "/admissions/apply",
}: ProgramCardProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg text-navy">{program.name}</CardTitle>
          {program.groupName ? (
            <Badge variant="secondary" className="shrink-0">
              {program.groupName}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        {program.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {program.description}
          </p>
        ) : null}
        <div className="space-y-1.5 text-sm">
          {program.duration ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              {program.duration}
            </p>
          ) : null}
          {program.subjects ? (
            <p className="line-clamp-2 text-muted-foreground">
              <span className="font-medium text-foreground">Subjects:</span>{" "}
              {program.subjects}
            </p>
          ) : null}
        </div>
      </CardContent>
      {ctaLabel ? (
        <CardFooter>
          <Button asChild size="sm" className="w-full">
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}