"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import type { BannerPublic } from "@/repositories/banners/banner.repository";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  imageUrl: string | null;
  mobileImageUrl: string | null;
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback",
    eyebrow: "Welcome to Scholar",
    title: siteConfig.fullName,
    description: siteConfig.description,
    href: siteConfig.applyUrl,
    ctaLabel: "Apply Now",
    imageUrl: null,
    mobileImageUrl: null,
  },
];

function toSlides(banners: BannerPublic[]): HeroSlide[] {
  return banners.map((banner) => ({
    id: banner.id,
    eyebrow: banner.subtitle ?? "Scholar Higher Secondary School and College",
    title: banner.title,
    description: banner.description ?? siteConfig.tagline,
    href: banner.linkUrl ?? siteConfig.applyUrl,
    ctaLabel: banner.ctaLabel ?? (banner.linkUrl ? "Learn More" : "Apply Now"),
    imageUrl: banner.imageUrl,
    mobileImageUrl: banner.imageUrl.endsWith("-desktop.jpeg")
      ? banner.imageUrl.replace("-desktop.jpeg", "-mobile.jpeg")
      : null,
  }));
}

export function HeroCarousel({ banners }: Readonly<{ banners: BannerPublic[] }>) {
  const slides = banners.length > 0 ? toSlides(banners) : FALLBACK_SLIDES;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative bg-navy-dark/70">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
            playOnInit: true,
          }),
        ]}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="min-h-150 sm:min-h-166 relative pl-0">
              {slide.imageUrl && (
                <>
                  <picture className="absolute inset-0 block">
                    {slide.mobileImageUrl ? (
                      <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />
                    ) : null}
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                  </picture>
                  <div className="absolute inset-0 bg-linear-to-br from-[#161556f7] to-navy-dark/30" />
                </>
              )}

              <Container className=" relative z-10 py-20 sm:py-28 lg:py-32">
                <div className="max-w-3xl space-y-5">
                  {slide.eyebrow ? (
                    <p className="text-sm font-semibold uppercase tracking-widest text-sky-200">
                      {slide.eyebrow}
                    </p>
                  ) : null}
                  <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                    {slide.title}
                  </h1>
                  {slide.description ? (
                    <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                      {slide.description}
                    </p>
                  ) : null}
                  <div className="pt-2">
                    <Button asChild size="lg" className="bg-white text-navy hover:bg-slate-100">
                      <Link href={slide.href}>
                        {slide.ctaLabel}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Container>
              {slides.length > 1 ? (
                <div
                  className="absolute bottom-0 right-[50%] z-10 flex items-center justify-center gap-2 pb-8"
                  role="tablist"
                  aria-label="Hero slides"
                >
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={index === current}
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                        index === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 top-1/2 hidden bg-white/10 text-white hover:bg-white/20 hover:text-white lg:flex" />
        <CarouselNext className="right-3 top-1/2 hidden bg-white/10 text-white hover:bg-white/20 hover:text-white lg:flex" />
      </Carousel>
    </section>
  );
}
