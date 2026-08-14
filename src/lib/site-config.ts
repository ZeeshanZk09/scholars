export const siteConfig = {
  name: "Scholar",
  fullName: "Scholar Higher Secondary School",
  tagline: "Excellence in education, character, and opportunity.",
  description:
    "Scholar Higher Secondary School, Scholar College, Scholar Coaching and Scholar Computer Courses provide a complete, well-rounded educational journey for students at every stage.",
  url: "https://scholarschool.edu.pk",
  locale: "en_PK",
  email: "info@scholarschool.edu.pk",
  phone: "+92 300 0000000",
  phoneHref: "+923000000000",
  address: "Main Boulevard, City, Pakistan",
  applyUrl: "/admissions/apply",
} as const;

export const institutions = [
  {
    title: "Scholar Higher Secondary School",
    shortTitle: "School",
    href: "/school",
    description:
      "A strong academic foundation from Nursery to Secondary with a focus on values, discipline and holistic growth.",
  },
  {
    title: "Scholar College",
    shortTitle: "College",
    href: "/college",
    description:
      "Intermediate programs in Pre-Medical, Pre-Engineering and Computer Science guided by experienced faculty.",
  },
  {
    title: "Scholar Coaching",
    shortTitle: "Coaching",
    href: "/coaching",
    description:
      "Board exam preparation and entry test coaching with structured study plans and regular assessments.",
  },
  {
    title: "Scholar Computer Courses",
    shortTitle: "Computer Courses",
    href: "/computer-courses",
    description:
      "Practical, career-focused courses in modern technologies designed for students and professionals.",
  },
] as const;