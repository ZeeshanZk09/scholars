import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "./container";
import { siteNav } from "./site-nav";

import { siteConfig, institutions } from "@/lib/site-config";

const quickLinks = siteNav.map((item) => ({
  label: item.label,
  href: item.href,
}));

const academicLinks = institutions.map((institution) => ({
  label: institution.shortTitle,
  href: institution.href,
}));

function FooterLink({
  href,
  children,
}: Readonly<{
  href: string;
  children: React.ReactNode;
}>) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-dark text-white">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold">Scholar</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {siteConfig.tagline} A single campus family — school, college, coaching and computer
              courses.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Quick Links
            </h2>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Academics">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Academics
            </h2>
            <ul className="space-y-2.5">
              {academicLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href="/programs">Academic Programs</FooterLink>
              </li>
              <li>
                <FooterLink href="/blogs">Blogs</FooterLink>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Contact
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href={siteConfig.applyUrl} className="transition-colors hover:text-white">
              Apply Now
            </Link>
            <Link href="/admissions" className="transition-colors hover:text-white">
              Admissions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
