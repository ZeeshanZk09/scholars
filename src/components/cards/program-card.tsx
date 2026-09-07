"use client";

import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import type { ProgramPublic } from "@/repositories/programs/program.repository";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useReducedMotion } from "@/lib/animations/accessibility";
import { ANIMATION_DURATIONS } from "@/lib/animations/config";
import { ANIMATION_PRESETS } from "@/lib/animations/presets";
import { cn } from "@/lib/utils";

type ProgramCardProps = {
  program: ProgramPublic;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ProgramCard({
  program,
  ctaLabel = "Apply Now",
  ctaHref = "/admissions/apply",
}: Readonly<ProgramCardProps>) {
  const reducedMotion = useReducedMotion();

  // Card mount animation using scaleIn preset
  const cardConfig = ANIMATION_PRESETS.scaleIn({
    duration: ANIMATION_DURATIONS.section,
    ease: "power3.out",
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "flex h-full flex-col transition-shadow hover:shadow-md",
        reducedMotion ? "" : "hover:shadow-lg"
      )}
      data-program-card
      variants={cardConfig.variants}
      initial={cardConfig.initial}
      animate={cardConfig.animate}
    >
      <Card className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 pt-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg text-navy">{program.name}</CardTitle>
            </div>
            {program.groupName ? (
              <Badge variant="secondary" className="shrink-0">
                {program.groupName}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 pb-4">
          {program.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{program.description}</p>
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
                <span className="font-medium text-foreground">Subjects:</span>
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
    </motion.div>
  );
}
