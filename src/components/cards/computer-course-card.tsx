import { CalendarClock, Clock, Laptop, Users, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ComputerCoursePublic } from "@/repositories/computer-courses/computer-course.repository";

type ComputerCourseCardProps = {
  course: ComputerCoursePublic;
};

export function ComputerCourseCard({ course }: ComputerCourseCardProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-navy/10 text-navy">
          <Laptop className="h-6 w-6" aria-hidden="true" />
        </span>
        <CardTitle className="text-lg text-navy">{course.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-4">
        {course.shortDescription ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {course.shortDescription}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {course.duration ? (
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {course.duration}
            </Badge>
          ) : null}
          {course.admissionStatus ? (
            <Badge variant="secondary">{course.admissionStatus}</Badge>
          ) : null}
        </div>
        {course.eligibility ? (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {course.eligibility}
          </p>
        ) : null}
        {course.timing ? (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {course.timing}
          </p>
        ) : null}
        {course.fee ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />
            {course.fee}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}