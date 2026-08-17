import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  "Complete education from Nursery to Intermediate",
  "School, College, Coaching and Computer Courses in one campus",
  "Experienced faculty and structured board preparation",
  "A safe, disciplined and student-focused environment",
];

export function InstitutionIntro() {
  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Welcome to Scholar
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              A Place to Learn, Grow and Succeed
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We combine strong academics with character development, so every student leaves
              Scholar prepared for examinations, higher education and the world beyond.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More About Scholar
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/images/pexels-max-fischer-5212320.jpg"
              alt="Students learning together in a classroom at Scholar"
              width={1280}
              height={853}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-4/3 h-auto w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
