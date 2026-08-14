import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";
import type { AdmissionPeriodRecord } from "@/repositories/admissions/admissions.repository";

type AdmissionCardProps = {
  period: AdmissionPeriodRecord;
};

export function AdmissionCard({ period }: AdmissionCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg text-navy">{period.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Session {period.session.name} · {period.category.replace(/_/g, " ")}
            </p>
          </div>
          <StatusBadge status={period.status} className="shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        {period.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {period.description}
          </p>
        ) : null}
        <dl className="space-y-1.5 text-sm text-muted-foreground">
          {period.openingDate ? (
            <div className="flex items-center gap-2">
              <dt className="font-medium text-foreground">Opens:</dt>
              <dd>{formatDate(period.openingDate)}</dd>
            </div>
          ) : null}
          {period.closingDate ? (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <dt className="font-medium text-foreground">Closes:</dt>
              <dd>{formatDate(period.closingDate)}</dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="w-full">
          <Link href="/admissions/apply">
            Apply Now
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}