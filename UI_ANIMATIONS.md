# Scholar Website - Detailed UI Animations Plan

## Overview
This document plans all GSAP animations for the Scholar public website, ensuring every section, component, and text element has purposeful, coordinated motion while maintaining performance, accessibility, and consistency.

**Design Principles:**
- **Performance-first**: Only `transform` + `opacity` animated; avoids `width`, `height`, `top`, `left`, `margin`, `padding`
- **Full reduced-motion support**: `prefers-reduced-motion` throughout with graceful degradation
- **Responsive behavior**: Distances/stagger scale down on mobile (60% of desktop values)
- **Content-first**: Animation supports hierarchy, never hides critical information
- **Consistent motion language**: Shared easing (power3.out), durations, distances across all pages
- **Purposeful only**: Every animation has a UX reason (hierarchy, feedback, guidance)
- **Interruptible**: Animations reverse/skip on user navigation/scroll
- **Not confusing**: Staggered, sequential but never overlapping in ways that cause visual clutter

---

## Animation Presets System (`src/lib/animations/presets.ts`)

### 5 Reusable Animation Presets

| Preset | Config | Easing | Duration | Stagger | Use Case |
|--------|--------|--------|----------|---------|----------|
| `fadeUp` | `y: 30 → 0`, `opacity: 0 → 1` | `power3.out` | `600ms` | `0ms` | Standard section entrance |
| `fadeDown` | `y: 30 → 0`, `opacity: 0 → 1` | `power2.out` | `600ms` | `0ms` | Dramatic content from below |
| `scaleIn` | `scale: 0.95 → 1`, `opacity: 0 → 1` | `power3.out` | `500ms` | `0ms` | Card entrance animations |
| `stagger` | `y: 25 → 0`, `opacity: 0 → 1`, `stagger: 0.15s` | `power3.out` | `500ms` | `0.15s` | Grid of cards, masonry layouts |
| `heroText` | `y: -30 → 0` (or `+30` if down), `opacity: 0 → 1` | `power3.out` | `800ms` | `0ms` | Hero section text lines |

**All animations respect `prefers-reduced-motion`** - swap to `linear` easing and `0ms` duration when enabled.

---

## Section/Component Animation Plan

Each section/component gets ONE specific animation type based on its position and purpose. No two sections use the same animation unless they're the same component type.

### 1. Hero Section (`HeroCarousel`)
- **Animation**: `heroText` preset + `useHeroBackgroundMovement` interactions
- **Sequence**:
  - Staggered text fade-in (eyebrow → h1 → p → CTA buttons)
  - Overlay settling with subtle opacity animation
  - Reduced motion: Ken Burns-style slow zoom/pan on image (or static image)
- **Data attributes**: `[data-hero-reveal]`
- **Timeline**: Runs once on mount, respects `reduced-motion` preference

### 2. Institution Intro Section (`InstitutionIntro`)
- **Animation**: `fadeUp` preset for text + subtle image scale
- **Sequence**:
  - `fadeUp`: Eyebrow → Title (Navy h2) → Supporting text → Image
  - Image: Subtle scale 1.0 → 1.02 on hover only
  - Reduced motion: Image stays static, only text animates
- **Data attributes**: `[data-section-reveal]`
- **Timeline**: Runs on mount, can also trigger on scroll if in viewport

### 3. Program Cards (`ProgramCard`)
- **Animation**: `scaleIn` preset on mount + `enhanceCardLift` hover interaction
- **Sequence**:
  - Mount: Scale from 0.95 to 1.0 with opacity fade
  - Hover: `translateY(-8px) scale(1.02)` + enhanced shadow
  - Active/press: `scale(0.97)` feedback
- **Data attributes**: `[data-card-reveal]`, `[data-card-hover]`
- **Timeline**: Mount animation + hover interactions

### 4. Admissions Page Sections (`AdmissionsPage`)
- **Animation**: `stagger` preset for grid cards + `scrollFadeUp` for section reveals
- **Sequence**:
  - Section 1 (Open periods): `stagger` - cards reveal one by one as scroll
  - Section 2 (Requirements): `fadeUp` - section content fades up
  - Section 3 (How to apply): `stagger` - step-by-step cards
  - Reduced motion: All animations reverse/skip gracefully
- **Data attributes**: `[data-section='admissions-open']`, `[data-section='admissions-requirements']`, etc.

### 5. Navbar (`SiteHeader`)
- **Animation**: Subtle entrance on page load + hover states
- **Sequence**:
  - Desktop: Nav links fade in from left (`translateX(-10px) → 0`) with slight delay per link
  - Mobile: Hamburger menu slides in from left, overlay fades in
  - Hover: Link text color change + subtle background highlight
  - Active state: Underline animation
- **Data attributes**: `[data-nav-link]`, `[data-header-btn]`

### 6. Program Cards List (`ProgramsPage`)
- **Animation**: Mixed - first card `scaleIn`, remaining `stagger`
- **Sequence**:
  - First card: Scale in from 0.95 (emphasis)
  - Remaining cards: Staggered reveal with 0.1s delay between each
  - Hover: All cards have `enhanceCardLift` on hover
- **Data attributes**: `[data-program-card]:first-child`, `[data-program-card]`

### 7. Testimonials Section (`TestimonialsSection`)
- **Animation**: `fadeUp` for quote text, `heroText` for author name
- **Sequence**:
  - Quote text: `fadeUp` from y=30
  - Author name: `heroText` sequential reveal
  - Rating stars: Small scale bounce (0.9 → 1) on mount
  - Reduced motion: No star bounce, just fade in
- **Data attributes**: `[data-testimonial-text]`, `[data-testimonial-author]`

### 8. Course Cards (`ComputerCoursesPage`, `CollegePage`)
- **Animation**: `stagger` for grid, `scaleIn` for individual card mount
- **Sequence**:
  - Grid layout: `stagger` reveal as user scrolls down
  - Individual card mount: `scaleIn` on page load
  - Hounter: `enhanceCardLift` on hover
- **Data attributes**: `[data-course-card]`

### 9. Contact Form (`ContactForm`)
- **Animation**: Input focus states + button hover
- **Sequence**:
  - Input focus: Label floats up, border turns navy, subtle glow
  - Button hover: Scale 1.01 + translate 2px
  - Button press: Scale 0.97
  - Form submit: Brief checkmark animation (CSS only, no GSAP)
- **Data attributes**: `[data-form-input]`, `[data-form-button]`

### 10. Accordion/FAQ (`FAQSection`)
- **Animation**: `fadeUp` on mount, arrow rotate on toggle
- **Sequence**:
  - Mount: All questions fade up from y=20
  - Toggle: Arrow rotates 180°, answer slides down (CSS height transition)
  - Reduced motion: No arrow rotation, just show/hide content
- **Data attributes**: `[data-accordion-question]`, `[data-accordion-answer]`

---

## Animation Timing & Delays

### Page Entry Timeline (~800ms total)
```
0ms:   Page transitions start (no splash screen)
100ms: Navbar fades in from left (links sequential: 0ms, 50ms, 100ms, 150ms)
200ms: Hero section text stagger begins (eyebrow → h1 → p → CTA)
400ms: Institution intro section fades up
500ms: Program cards scale in (first card emphasized)
600ms: Admissions section cards stagger reveal
700ms: Other page sections fade up
800ms: All animations complete - page is fully interactive
```

### Section-Specific Delays
- **Hero text**: 0ms, 50ms, 100ms, 150ms (4 elements sequential)
- **Program cards (grid)**: 0ms, 100ms, 200ms, 300ms (4 cards staggered)
- **Admissions cards**: 0ms, 100ms, 200ms (3 sections)
- **Navbar links**: 0ms, 50ms, 100ms, 150ms, 200ms (5 links)

---

## Reduced Motion Strategy

### When `prefers-reduced-motion: reduce` is Active:

| Animation | Reduced Motion Equivalent |
|-----------|--------------------------|
| `fadeUp` | `opacity: 1` instantly, no y translation |
| `fadeDown` | `opacity: 1` instantly |
| `scaleIn` | `scale: 1`, `opacity: 1` instantly |
| `stagger` | All items appear instantly, no stagger |
| `heroText` | All text appears instantly, no sequence |
| Navbar links | Instant fade-in, no delay |
| Hover effects | `transform: none`, no transition |
| Card lift | `translateY: 0`, no shadow change |

### Graceful Degradation Rules
1. **Never break layout**: Reduced motion never changes layout, only animation values
2. **Never hide content**: Always visible, just without motion
3. **Never increase complexity**: Simplify, don't add animations
4. **Test explicitly**: Verify reduced motion preference is checked on all animations

---

## Design-to-Animation Mapping

### How to Map Design to Animation

1. **Identify the element type**: Text, image, card, button, link, accordion, etc.
2. **Determine the element's role**: Heading, description, interactive, decorative
3. **Select the animation type** from the table above based on role
4. **Set the duration** based on the element's importance (important = longer, subtle = shorter)
5. **Set the delay** based on the animation sequence position
6. **Add data attributes** for GSAP targeting
7. **Test with reduced motion** preference enabled
8. **Verify on mobile** (distances scaled to 60%)

### Example Mapping Table

| Design Element | Animation Type | Duration | Delay | Easing | Data Attribute |
|----------------|---------------|----------|-------|--------|----------------|
| Hero page heading | `heroText` | 800ms | 0ms (first) | power3.out | `[data-hero-reveal]` |
| Subhero/eyebrow | `heroText` | 800ms | 50ms | power3.out | `[data-hero-reveal]` |
| Hero CTA button | `scaleIn` + hover | 500ms | 150ms | power3.out | `[data-cta-reveal]` |
| Section heading | `fadeUp` | 600ms | 0ms | power3.out | `[data-section-reveal]` |
| Section paragraph | `fadeUp` | 600ms | 100ms | power3.out | `[data-section-reveal]` |
| Feature card (grid) | `stagger` | 500ms | N/A (grid) | power3.out | `[data-card-reveal]` |
| Card hover | `enhanceCardLift` | 200ms | N/A | power3.out | `[data-card-hover]` |
| Nav link | Subtle fade/translate | 200ms | N/A | power3.out | `[data-nav-link]` |
| Accordion question | `fadeUp` | 400ms | N/A | power3.out | `[data-accordion-question]` |

---

## Implementation Checklist

### [x] Animation Architecture
- [x] `src/lib/animations/config.ts` - ANIMATION_PRESETS exported
- [x] `src/lib/animations/eases.ts` - easing shortcut functions
- [x] `src/lib/animations/accessibility.ts` - useReducedMotion() hook
- [x] `src/lib/animations/presets.ts` - 5 animation presets with typing

### [x] Page Animations
- [x] HeroCarousel: heroText + background movement
- [x] InstitutionIntro: fadeUp + image hover scale
- [x] ProgramCards: scaleIn + enhanceCardLift hover
- [x] AdmissionsPage: stagger + fadeUp section reveals
- [x] Navbar: link entrance delays + hover states
- [x] All 17+ public pages have appropriate animation

### [x] Quality Gates
- [x] TypeScript compiles cleanly
- [x] ESLint passes (codebase only)
- [x] Next.js build succeeds
- [x] Reduced motion works correctly
- [x] No layout shifts from animations
- [x] No horizontal overflow
- [x] Performance-friendly (transform + opacity only)

### [x] Testing
- [x] Verify animations on desktop (1440px, 1280px)
- [x] Verify animations on tablet (768px, 375px, 320px)
- [x] Verify reduced motion preference works
- [x] Verify mobile animations use 60% distances
- [x] No animation-related console errors

---

## Animation Summary by Page

| Page | Animated Elements | Animation Types |
|------|------------------|----------------|
| Home | Hero carousel, institution intro, program cards | heroText, fadeUp, scaleIn, stagger |
| About | Hero text, stats count-up, feature cards | heroText, countUp, scaleIn |
| Faculty | Section reveals, card hovers | fadeUp, enhanceCardLift |
| Programs | Course grid stagger, individual card scaleIn | stagger, scaleIn |
| Admissions | Open periods grid, requirements, CTA steps | stagger, fadeUp, useAttractiveCardEntrance |
| Computer Courses | Course cards, grid reveal | stagger, scaleIn |
| College | Course cards, grid reveal | stagger, scaleIn |
| Coaching | Program cards, section reveals | scaleIn, fadeUp |
| Academics | Section headers, content reveals | fadeUp, useSectionEntranceTimeline |
| Testimonials | Quote text, author names, ratings | fadeUp, heroText, scaleIn |
| Contact | Form inputs, button hover | inputFocus, enhanceButtonHover |
| School | Section reveals, content hierarchy | fadeUp, useSectionEntranceTimeline |
| College | Section reveals, content hierarchy | fadeUp, useSectionEntranceTimeline |
| Computer Courses | Course grid, card hovers | stagger, enhanceCardLift |
| Coaching | Program cards, section reveals | scaleIn, fadeUp |
| Academics | Content reveals, headers | fadeUp |
| Blogs | Post cards, section reveals | stagger, fadeUp |
| School | Section reveals, content hierarchy | fadeUp |
| College | Section reveals, content hierarchy | fadeUp |
| Computer Courses | Course grid, card hovers | stagger, enhanceCardLift |
| Coaching | Program cards, section reveals | scaleIn, fadeUp |
| Academics | Content reveals, headers | fadeUp |

---

## Developer Notes

### Adding New Animations
1. **Choose the preset** from `ANIMATION_PRESETS` that matches the element type
2. **Call the preset function** with options object in the component
3. **Apply the returned config** to a GSAP timeline or to() / from() call
4. **Add data attribute** for targeting: `[data-reveal='preset-name']`
5. **Test with reduced motion** enabled
6. **Test on mobile** (distances scaled)
7. **Add to documentation** if new animation type

### Override Options
All preset functions accept an `options` object with overrides:
- `duration`: Override default duration
- `delay`: Add delay to the animation
- `ease`: Override the default easing
- `distance`: Override the default y/x translation
- `stagger`: Override the default stagger amount
- Any other GSAP tween property can be spread in via `...extra`

### Example Usage
```tsx
import { ANIMATION_PRESETS } from '@/lib/animations/presets'

// Hero text sequential reveal
const heroConfig = ANIMATION_PRESETS.heroText({
  duration: 800,
  delay: 0,
})

// Use with GSAP
gsap.from(heroConfig.targets, {
  ...heroConfig,
  ease: heroConfig.ease,
})
```

---

## Final Notes

- **Animations are unobtrusive**: They enhance, never distract
- **Animations are purposeful**: Every motion has a reason (hierarchy, feedback, guidance)
- **Animations are accessible**: Full reduced-motion support
- **Animations are performant**: transform + opacity only, 60fps on mobile
- **Animations are consistent**: Shared easing, durations, patterns across the site
- **Animations are interruptible**: User navigation skips/resets animations

The Scholar website now has a comprehensive, well-planned animation system that transforms it from static to premium interactive while maintaining excellence in performance, accessibility, and design fidelity.