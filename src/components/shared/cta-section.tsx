import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

type CtaSectionProps = {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CtaSection({
  title,
  description,
  primaryLabel = "Apply Now",
  primaryHref = "/admissions/apply",
  secondaryLabel,
  secondaryHref,
}: Readonly<CtaSectionProps>) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-navy hover:bg-slate-100">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            {secondaryLabel && secondaryHref ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
