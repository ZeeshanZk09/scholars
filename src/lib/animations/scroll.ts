/**
 * Scroll-triggered GSAP animations.
 * All animations respect the user's prefers-reduced-motion preference.
 * Animations only use transform and opacity for performance.
 */
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { useReducedMotion } from "./accessibility";

gsap.registerPlugin(ScrollTrigger);

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
    gsap.set(trigger, { opacity: 1, y: 0 });
    return;
  }

  return {
    scrollTrigger: {
      trigger,
      start: "top 80%",
      end: "bottom 20%",
      scrub: false,
      once,
    },
    animations: [
      {
        type: "from",
        targets: trigger,
        y: distance,
        opacity: 0,
        duration,
        ease,
        stagger,
      },
    ],
  }
}
