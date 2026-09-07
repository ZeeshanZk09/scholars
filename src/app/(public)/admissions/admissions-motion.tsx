"use client";

import { motion, type Variants } from "motion/react";
import * as React from "react";
import { useReducedMotion } from "@/lib/animations/accessibility";

export function AdmissionsMotion({ children }: Readonly<{ children: React.ReactNode }>) {
  const reducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Use motion variants for staggered reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={containerRef}
      className="space-y-6"
      style={reducedMotion ? {} : {}}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const childRef = React.useRef<HTMLDivElement>(null);

        return React.cloneElement(child, {
          ...(reducedMotion ? {} : {
            ref: childRef,
            initial: "hidden",
            animate: "visible",
            variants: {
              container: containerVariants,
              item: {
                ...itemVariants,
                transition: { delayChildren: index * 0.15 },
              },
            },
          }),
        });
      })}
    </div>
  );
}