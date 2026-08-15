import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

const ContactForm = dynamic(() =>
  import("@/components/forms/contact-form").then((mod) => mod.ContactForm)
);

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Scholar — admissions, campus visits, fees and general enquiries.",
  alternates: {
    canonical: "/contact",
  },
};

const officeHours = [
  { days: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
  { days: "Saturday", hours: "8:00 AM – 1:00 PM" },
  { days: "Sunday", hours: "Closed" },
];

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address
  )}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="We're Here to Help"
        description="Questions about admissions, fees, or a campus visit? Reach out — our team is happy to help."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact information */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="mt-0.5 text-muted-foreground">{siteConfig.address}</p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        Get Directions
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a
                        href={`tel:${siteConfig.phoneHref}`}
                        className="mt-0.5 text-muted-foreground hover:text-primary"
                      >
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="mt-0.5 text-muted-foreground hover:text-primary"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {officeHours.map((slot) => (
                    <div
                      key={slot.days}
                      className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        {slot.days}
                      </span>
                      <span className="font-medium text-foreground">{slot.hours}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Prefer visiting before you apply?{" "}
                <Link href="/admissions" className="font-medium text-primary hover:underline">
                  Check our admission dates
                </Link>{" "}
                and plan a campus tour.
              </p>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">Send us a Message</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within one working day.
                  </p>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
