export type NavDropdownItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavDropdownItem[];
};

export const siteNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "School", href: "/school", description: "Nursery to Matric" },
      {
        label: "College",
        href: "/college",
        description: "Intermediate programs",
      },
      { label: "Coaching", href: "/coaching", description: "Exam preparation" },
      {
        label: "Computer Courses",
        href: "/computer-courses",
        description: "Professional training",
      },
    ],
  },
  {
    label: "Explore",
    href: "/programs",
    children: [
      { label: "Academic Programs", href: "/programs" },
      { label: "Facilities", href: "/facilities" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blogs", href: "/blogs" },
    ],
  },
  { label: "Admissions", href: "/admissions" },
  { label: "Contact", href: "/contact" },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
