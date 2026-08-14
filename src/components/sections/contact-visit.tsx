import Link from "next/link";
import { Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const officeHours = [
  { days: "Monday – Saturday", time: "8:00 AM – 4:00 PM" },
  { days: "Sunday", time: "Closed" },
];

export function ContactVisit() {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address
  )}`;

  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-24">
        <SectionHeader
          eyebrow="Contact & Visit Us"
          title="We Would Love to Hear From You"
          description="Questions about admissions, programs or the campus? Reach out and our team will be happy to help."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-navy">Contact Details</h3>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-navy">Phone</p>
                  <a
                    href={`tel:${siteConfig.phoneHref}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-navy">Email</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-navy">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {siteConfig.address}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-navy">Office Hours</p>
                  <ul className="mt-1 space-y-1">
                    {officeHours.map((hours) => (
                      <li
                        key={hours.days}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <span className="w-32">{hours.days}</span>
                        <span>{hours.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/contact">
                  <MessageSquare aria-hidden="true" />
                  Send a Message
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin aria-hidden="true" />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-navy p-6 text-white sm:p-8">
            <h3 className="text-lg font-semibold">Visit Our Campus</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              See our classrooms, labs and facilities in person. Book a campus
              visit during office hours — we will arrange a guided tour and
              answer all your questions about admissions.
            </p>
            <div className="mt-6 rounded-lg border border-white/15 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Why visit?</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Meet our faculty and admissions team</li>
                <li>Tour classrooms, labs and facilities</li>
                <li>Understand programs and fee structure</li>
                <li>Start or speed up your admission process</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}