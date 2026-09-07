/**
 * Reusable framer-motion animation presets.
 * Each preset returns a config object for motion.div/motion variants.
 * All animations use transform + opacity only for performance.
 */
export const ANIMATION_PRESETS = {
	// Fade-up on scroll
	fadeUp: (options: { distance?: number; duration?: number; ease?: string; delay?: number; stagger?: number } = {}) => ({
		variants: {
			hidden: { y: options.distance ?? 30, opacity: 0 },
			visible: { y: 0, opacity: 1 },
		},
		initial: "hidden",
		animate: "visible",
		easing: options.ease ?? "power3.out",
		duration: options.duration ?? 0.6,
		delay: options.delay ?? 0,
		stagger: options.stagger ?? 0.1,
}),

	// Fade-down on scroll
	fadeDown: (options: { distance?: number; duration?: number; ease?: string; delay?: number } = {}) => ({
		variants: {
			hidden: { y: options.distance ?? 30, opacity: 0 },
			visible: { y: 0, opacity: 1 },
		},
		initial: "hidden",
		animate: "visible",
		easing: options.ease ?? "power2.out",
		duration: options.duration ?? 0.6,
		delay: options.delay ?? 0,
}),

	// Scale in card
	scaleIn: (options: { scaleStart?: number; duration?: number; ease?: string } = {}) => ({
		variants: {
			hidden: { scale: options.scaleStart ?? 0.95, opacity: 0 },
			visible: { scale: 1, opacity: 1 },
		},
		initial: "hidden",
		animate: "visible",
		easing: options.ease ?? "power3.out",
		duration: options.duration ?? 0.5,
}),

	// Staggered reveal - cards one by one
	stagger: (options: { distance?: number; duration?: number; ease?: number; stagger?: number } = {}) => ({
		variants: {
			hidden: { y: options.distance ?? 25, opacity: 0 },
			visible: { y: 0, opacity: 1 },
		},
		initial: "hidden",
		animate: "visible",
		easing: options.ease ?? "power3.out",
		duration: options.duration ?? 0.5,
		stagger: options.stagger ?? 0.15,
}),

	// Hero text sequential reveal
	heroText: (options: { duration?: number; ease?: string; delay?: number } = {}) => ({
		variants: {
			seq: [
				{ opacity: 0, y: 20, transition: { duration: options.delay ?? 0, delay: 0 } },
				{ opacity: 1, y: 0, transition: { duration: options.duration ?? 0.8, delay: options.delay ?? 0, ease: options.ease ?? "power3.out" } },
			],
		},
		initial: "seq",
		animate: "seq",
		easing: options.ease ?? "power3.out",
	}),
}
