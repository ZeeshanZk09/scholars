import {
  BookOpen,
  Building2,
  Dumbbell,
  FlaskConical,
  Library,
  Monitor,
  Music,
  School,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { createElement } from "react";

import type { FacilityPublic } from "@/repositories/facilities/facility.repository";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FacilityCardProps = {
  facility: FacilityPublic;
};

const FACILITY_ICONS: Record<string, typeof Building2> = {
  computer: Monitor,
  lab: FlaskConical,
  science: FlaskConical,
  library: Library,
  books: BookOpen,
  classroom: School,
  school: School,
  sports: Dumbbell,
  playground: Dumbbell,
  music: Music,
  health: Stethoscope,
  medical: Stethoscope,
};

function iconFor(icon: string | null) {
  if (!icon) {
    return Building2;
  }
  return FACILITY_ICONS[icon.toLowerCase()] ?? Building2;
}

function renderIcon(icon: string | null) {
  return createElement(iconFor(icon), {
    className: "h-5 w-5",
    "aria-hidden": true,
  });
}

export function FacilityCard({ facility }: FacilityCardProps) {
  if (facility.imageUrl) {
    return (
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden bg-navy/5">
          <Image
            src={facility.imageUrl}
            alt={facility.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="flex-row items-center gap-4 pb-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
            {renderIcon(facility.icon)}
          </span>
          <CardTitle className="text-lg text-navy">{facility.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 pb-5">
          {facility.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {facility.description}
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-center gap-4 pb-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
          {renderIcon(facility.icon)}
        </span>
        <CardTitle className="text-lg text-navy">{facility.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-5">
        {facility.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {facility.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            A modern, well-maintained facility at Scholar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
