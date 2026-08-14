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
  { label: "School", href: "/school" },
  { label: "College", href: "/college" },
  { label: "Coaching", href: "/coaching" },
  { label: "Computer Courses", href: "/computer-courses" },
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