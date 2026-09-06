/**
 * Reusable GSAP animation presets.
 * Each preset returns a config object for gsap.from()/to()/timeline().
 * All animations use transform + opacity only for performance.
 */
export const ANIMATION_PRESETS = {
	// Fade-up on scroll
	fadeUp: (options: { distance?: number; duration?: number; ease?: string; delay?: number; stagger?: number } = {}) => ({
		type: "from",
		targets: "[data-reveal='up']",
		y: options.distance ?? 30,
		opacity: 0,
		duration: options.duration ?? 600,
		ease: options.ease ?? "power3.out",
		delay: options.delay ?? 0,
		stagger: options.stagger ?? 0,
	}),

	// Fade-down on scroll
	fadeDown: (options: { distance?: number; duration?: number; ease?: string; delay?: number } = {}) => ({
		type: "from",
		targets: "[data-reveal='down']",
		y: options.distance ?? 30,
		opacity: 0,
		duration: options.duration ?? 600,
		ease: options.ease ?? "power2.out",
		delay: options.delay ?? 0,
	}),

	// Scale in card
	scaleIn: (options: { scaleStart?: number; duration?: number; ease?: string } = {}) => ({
		type: "from",
		targets: "[data-reveal='scale']",
		scale: options.scaleStart ?? 0.95,
		opacity: 0,
		duration: options.duration ?? 500,
		ease: options.ease ?? "power3.out",
	}),

	// Staggered reveal - cards one by one
	stagger: (options: { distance?: number; duration?: number; ease?: number; stagger?: number } = {}) => ({
		type: "from",
		targets: "[data-reveal='stagger']",
		y: options.distance ?? 25,
		opacity: 0,
		duration: options.duration ?? 500,
		ease: options.ease ?? "power3.out",
		stagger: options.stagger ?? 0.15,
	}),

	// Hero text sequential reveal
	heroText: (options: { duration?: number; ease?: string; delay?: number } = {}) => ({
		type: "sequence",
		targets: "[data-reveal='hero-text']",
		duration: options.duration ?? 800,
		ease: options.ease ?? "power3.out",
		delay: options.delay ?? 0,
	}),
}