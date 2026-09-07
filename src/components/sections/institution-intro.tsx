"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/animations/accessibility";
import { ANIMATION_DURATIONS } from "@/lib/animations/config";
import { ANIMATION_PRESETS } from "@/lib/animations/presets";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  "Complete education from Nursery to Intermediate",
  "School, College, Coaching and Computer Courses in one campus",
  "Experienced faculty and structured board preparation",
  "A safe, disciplined and student-focused environment",
];

export function InstitutionIntro() {
  const reducedMotion = useReducedMotion();

  const fadeUpConfig = ANIMATION_PRESETS.fadeUp({
    distance: 30,
    duration: ANIMATION_DURATIONS.section,
    ease: "power3.out",
    delay: 0,
  });

  return (
    <section
      className="bg-white"
      data-section-reveal="institution"
      style={reducedMotion ? { animation: "none" } : {}}
    >
      <Container className="py-16 sm:py-24">
        <motion.div
          variants={fadeUpConfig.variants}
          initial={fadeUpConfig.initial}
          animate={fadeUpConfig.animate}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <motion.div
            variants={fadeUpConfig.variants}
            initial={fadeUpConfig.initial}
            animate={fadeUpConfig.animate}
            style={reducedMotion ? { opacity: 1, y: 0 } : {}}
          >
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
          </motion.div>
          <motion.div
            className="relative overflow-hidden rounded-xl"
            style={reducedMotion ? { opacity: 1 } : {}}
          >
            <Image
              src="/scholars-schools-official-images/01-classroom-activities/classroom-activity-013.jpg"
              alt="Students learning together in a classroom at Scholar"
              width={1280}
              height={853}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-4/3 h-auto w-full object-cover transition-opacity duration-500 group-hover:opacity-[0.9]"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
