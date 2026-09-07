"use client";

import { type Variants } from "motion/react";
import { Children, cloneElement, isValidElement } from "react";

import { useReducedMotion } from "@/lib/animations/accessibility";

export function AdmissionsMotion({ children }: Readonly<{ children: React.ReactNode }>) {
  const reducedMotion = useReducedMotion();

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
    <div className="space-y-6">
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null;

        return cloneElement(child, {
          ...(reducedMotion
            ? {}
            : {
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
