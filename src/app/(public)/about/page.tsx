import { UserIcon } from "lucide-react";
import Image from "next/image";

import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { institutions } from "@/lib/site-config";
import { ManagementService } from "@/services/management";
import { PrincipalService } from "@/services/principal";

export const metadata: Metadata = {
  title: "About Scholar",
  description:
    "Learn about Scholar Higher Secondary School, College, Coaching and Computer Courses — our mission, values and complete educational journey.",
  alternates: {
    canonical: "/about",
  },
};

export const revalidate = 300;

const values = [
  {
    title: "Academic Excellence",
    description:
      "We set high standards and give every student the support needed to meet them — from clear lessons to focused exam preparation.",
  },
  {
    title: "Character First",
    description:
      "Discipline, honesty and respect are part of everyday campus life, shaping students into responsible individuals.",
  },
  {
    title: "Caring Environment",
    description:
      "Teachers know their students by name and by need, creating a safe place where every learner feels valued.",
  },
  {
    title: "Opportunity for All",
    description:
      "Affordable quality education and support for students at every stage, from early schooling to professional skills.",
  },
];

export default async function AboutPage() {
  const [principalMessages, managementMembers] = await Promise.all([
    new PrincipalService().listPublished({ take: 1 }),
    new ManagementService().listPublished(),
  ]);

  const principalMessage = principalMessages[0] ?? null;

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="One Institution, a Complete Educational Journey"
        description="Scholar brings together a school, a college, exam coaching and computer courses on one campus — so students can continue their education with us from the first day of school to professional skill training."
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            align="left"
            eyebrow="Our Mission"
            title="Excellence in Education, Character, and Opportunity"
            description="Our mission is to provide a complete, well-rounded education that develops strong minds, good character and real skills — preparing students for board examinations, higher education and the professional world."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {institutions.map((institution) => (
              <div key={institution.href} className="rounded-lg border bg-surface p-6">
                <h3 className="text-lg font-semibold text-navy">{institution.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {institution.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeader
            eyebrow="Our Values"
            title="What We Stand For"
            description="These principles guide how we teach, how we behave and how we run our campus every day."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-lg border bg-white p-6">
                <h3 className="text-lg font-semibold text-navy">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {principalMessage ? (
        <section className="bg-surface">
          <Container className="py-16 sm:py-24">
            <SectionHeader
              align="left"
              eyebrow="From the Principal's Desk"
              title="Principal's Message"
              description="A message from the principal on our vision for every learner at Scholar."
            />
            <div className="mt-10 grid items-start gap-8 md:grid-cols-[260px_1fr]">
              <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 md:w-full">
                {principalMessage.profileImageUrl ? (
                  <Image
                    src={principalMessage.profileImageUrl}
                    alt={principalMessage.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 260px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <UserIcon className="h-16 w-16" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <blockquote className="border-l-4 border-navy/20 pl-4 text-base leading-relaxed text-slate-700">
                  {principalMessage.message}
                </blockquote>
                {principalMessage.biography ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {principalMessage.biography}
                  </p>
                ) : null}
                <div>
                  <p className="text-base font-semibold text-navy">{principalMessage.name}</p>
                  {principalMessage.designation ? (
                    <p className="text-sm text-muted-foreground">{principalMessage.designation}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {managementMembers.length > 0 ? (
        <section className="bg-white">
          <Container className="py-16 sm:py-24">
            <SectionHeader
              align="left"
              eyebrow="Leadership"
              title="Our Management"
              description="The team guiding Scholar's mission of quality education for every student."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {managementMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <UserIcon className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold text-navy">{member.name}</h3>
                    {member.designation ? (
                      <p className="mt-1 text-sm font-medium text-primary">{member.designation}</p>
                    ) : null}
                    {member.biography ? (
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">
                        {member.biography}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaSection
        title="Experience Scholar Firsthand"
        description="Visit our campus, meet our faculty and see how we support every student's success."
        primaryLabel="Book a Visit"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
