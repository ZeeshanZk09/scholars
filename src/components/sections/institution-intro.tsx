"use client";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/animations/accessibility";
import { ANIMATION_DURATIONS } from "@/lib/animations/config";
import { easing } from "@/lib/animations/eases";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  "Complete education from Nursery to Intermediate",
  "School, College, Coaching and Computer Courses in one campus",
  "Experienced faculty and structured board preparation",
  "A safe, disciplined and student-focused environment",
];

export function InstitutionIntro() {
  const reducedMotion = useReducedMotion();

  // Hero entrance animation - runs once when component mounts
  React.useEffect(() => {
    if (reducedMotion) {
      // Instantly set to final state without animation
      gsap.set(".institution-intro .text-primary", { opacity: 1, y: 0 });
      gsap.set(".institution-intro .text-navy", { opacity: 1, y: 0 });
      gsap.set(".institution-intro h2", { opacity: 1, y: 0 });
      gsap.set(".institution-intro .text-muted-foreground", { opacity: 1, y: 0 });
      gsap.set(".institution-intro .bg-white img", { opacity: 1 });
      return;
    }

    const delay = 0.1;
    const timeline = gsap.timeline({
      delay,
    });

    // Fade in eyebrow/title elements sequentially
    timeline.from(".institution-intro .text-primary", {
      opacity: 0,
      y: 25,
      duration: ANIMATION_DURATIONS.normal,
      ease: easing.reveal(),
    });

    timeline.from(".institution-intro .text-navy", {
      opacity: 0,
      y: 25,
      duration: ANIMATION_DURATIONS.normal,
      ease: easing.reveal(),
      delay: 0.1,
    });

    timeline.from(".institution-intro h2", {
      opacity: 0,
      y: 25,
      duration: ANIMATION_DURATIONS.normal,
      ease: easing.reveal(),
      delay: 0.15,
    });

    // Fade in supporting text
    timeline.from(".institution-intro .text-muted-foreground", {
      opacity: 0,
      y: 15,
      duration: ANIMATION_DURATIONS.micro,
      ease: easing.ui(),
      delay: 0.2,
    });

    // Fade in image
    timeline.from(".institution-intro .bg-white img", {
      opacity: 0,
      duration: ANIMATION_DURATIONS.normal,
      ease: "power2.out",
      delay: 0.3,
    });

    // Clean up on unmount
    return () => {
      timeline.kill();
    };
  }, [reducedMotion]);

  return (
    <section className="bg-white" data-section-reveal="institution">
      <Container className="py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Welcome to Scholar
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              A Place to Learn, Grow and Succeed
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We combine strong academics with character development, so every student leaves
              Scholar prepared for examinations, higher education and the world beyond.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More About Scholar
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/scholars-schools-official-images/01-classroom-activities/classroom-activity-013.jpg"
              alt="Students learning together in a classroom at Scholar"
              width={1280}
              height={853}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-4/3 h-auto w-full object-cover transition-opacity duration-500 group-hover:opacity-[0.9]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
