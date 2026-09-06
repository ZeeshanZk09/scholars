"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/animations/accessibility";
import { ANIMATION_DURATIONS } from "@/lib/animations/config";
import { easing } from "@/lib/animations/eases";

export function AdmissionsMotion({ children }: Readonly<{ children: React.ReactNode }>) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>(".admission-card");
    if (cards.length === 0) return;

    if (reducedMotion) {
      // Instantly set to final state without animation
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    const context = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 15,
        stagger: 0.1,
        duration: ANIMATION_DURATIONS.normal,
        ease: easing.reveal(),
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
      });
    }, container);

    return () => context.revert();
  }, [reducedMotion]);

  return <div ref={containerRef}>{children}</div>;
}
