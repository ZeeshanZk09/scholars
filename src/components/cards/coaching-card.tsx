import { BookOpen, Clock, Users, Wallet } from "lucide-react";
import Link from "next/link";

import type { CoachingProgramPublic } from "@/repositories/coaching/coaching.repository";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CoachingCardProps = {
  program: CoachingProgramPublic;
};

export function CoachingCard({ program }: CoachingCardProps) {
  return (
    <Link
      href={`/academics/coaching/${program.slug}`}
      className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          {program.category ? (
            <Badge variant="secondary" className="w-fit">
              {program.category}
            </Badge>
          ) : null}
          <CardTitle className="text-lg text-navy">{program.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        {program.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {program.description}
          </p>
        ) : null}
        <div className="space-y-1.5 text-sm text-muted-foreground">
          {program.targetStudents ? (
            <p className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {program.targetStudents}
            </p>
          ) : null}
          {program.timing || program.duration ? (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              {[program.timing, program.duration].filter(Boolean).join(" · ")}
            </p>
          ) : null}
          {program.subjects ? (
            <p className="flex items-start gap-2">
              <BookOpen
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>
                <span className="font-medium text-slate-800">Subjects:</span>{" "}
                {program.subjects}
              </span>
            </p>
          ) : null}
          {program.feeInformation ? (
            <p className="flex items-center gap-2">
              <Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />
              {program.feeInformation}
            </p>
          ) : null}
        </div>
        {program.admissionStatus ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {program.admissionStatus}
          </span>
        ) : null}
      </CardContent>
      </Card>
    </Link>
  );
}
