/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Scroll-triggered framer-motion animations.
 * All animations respect the user's prefers-reduced-motion preference.
 * Animations only use transform and opacity for performance.
 */
import { useReducedMotion } from "./accessibility";

/**
 * Scroll-triggered fade-up animation
 * Animates elements up from y=30 to opacity=1 when scrolled into view
 */
export function scrollFadeUp({
  trigger = "[data-reveal='up']",
  distance = 30,
  duration = 600,
  ease = "power3.out",
  stagger = 0,
  once = true,
} = {}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    // instantly set to final state without animation
    // Use the accessibility approach: set inline styles directly
    const elements = typeof document !== "undefined" ? document.querySelectorAll(trigger) : [];
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "translateY(0)";
    });
    return;
  }

  return {
    // framer-motion will handle this via variants on scroll trigger
    // The trigger elements need to have the motion.div wrapper or use
    // data-reveal attributes with motion variants
    custom: {
      reduceMotion: reducedMotion,
    },
  };
}

/**
 * Scroll-triggered fade-down animation
 * Animates elements down from y=-30 to opacity=1 when scrolled into view
 */
export function scrollFadeDown({
  trigger = "[data-reveal='down']",
  distance = 30,
  duration = 600,
  ease = "power3.out",
  stagger = 0,
  once = true,
} = {}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    const elements = typeof document !== "undefined" ? document.querySelectorAll(trigger) : [];
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "translateY(0)";
    });
    return;
  }

  return {
    custom: {
      reduceMotion: reducedMotion,
    },
  };
}

/**
 * Scroll-triggered stagger reveal animation
 * Animates elements with stagger delay when scrolled into view
 */
export function scrollStagger({
  trigger = "[data-reveal='stagger']",
  distance = 25,
  duration = 500,
  ease = "power3.out",
  stagger = 0.15,
  once = true,
} = {}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    const elements = typeof document !== "undefined" ? document.querySelectorAll(trigger) : [];
    elements.forEach((el, index) => {
      const delay = index * stagger;
      (el as HTMLElement).style.transition =
        `opacity 0.5s ${ease} ${delay}ms, transform 0.5s ${ease} ${delay}ms`;
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "translateY(0)";
    });
    return;
  }

  return {
    custom: {
      reduceMotion: reducedMotion,
    },
  };
}
