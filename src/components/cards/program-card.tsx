"use client";
import { gsap } from "gsap";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import type { ProgramPublic } from "@/repositories/programs/program.repository";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useReducedMotion } from "@/lib/animations/accessibility";
import { ANIMATION_DURATIONS } from "@/lib/animations/config";
import { easing } from "@/lib/animations/eases";
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
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Scale in animation on mount
  React.useEffect(() => {
    const cardElement = cardRef.current;

    if (!cardElement) {
      return;
    }

    if (reducedMotion) {
      gsap.set(cardElement, { clearProps: "opacity,transform" });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(cardElement, { scale: 0.95, opacity: 0 });
    }, cardElement);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        context.add(() => {
          gsap.to(cardElement, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            clearProps: "opacity,transform",
          });
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(cardElement);

    return () => {
      observer.disconnect();
      context.revert();
    };
  }, [reducedMotion]);

  // Card hover lift animation using GSAP
  React.useEffect(() => {
    const cardElement = cardRef.current;

    if (!cardElement || reducedMotion) {
      return;
    }

    const hoverTimeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: ANIMATION_DURATIONS.normal,
        ease: easing.reveal(),
      },
    });

    hoverTimeline.to(cardElement, {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    });

    const mouseEnter = () => hoverTimeline.play();
    const mouseLeave = () => hoverTimeline.reverse();

    cardElement.addEventListener("mouseenter", mouseEnter);
    cardElement.addEventListener("mouseleave", mouseLeave);

    return () => {
      hoverTimeline.kill();
      cardElement.removeEventListener("mouseenter", mouseEnter);
      cardElement.removeEventListener("mouseleave", mouseLeave);
    };
  }, [reducedMotion]);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "flex h-full flex-col transition-shadow hover:shadow-md",
        reducedMotion ? "" : "hover:shadow-lg"
      )}
      data-program-card
    >
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
              <span className="font-medium text-foreground">Subjects:</span> {program.subjects}
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
