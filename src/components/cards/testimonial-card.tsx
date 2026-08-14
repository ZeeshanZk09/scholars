import { Quote, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { TestimonialPublic } from "@/repositories/testimonials/testimonial.repository";

type TestimonialCardProps = {
  testimonial: TestimonialPublic;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const role = testimonial.role ?? testimonial.type.toLowerCase();

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
            <Quote className="h-4 w-4" aria-hidden="true" />
          </span>
          {testimonial.rating > 0 ? (
            <div
              className="flex items-center gap-0.5"
              aria-label={`Rated ${testimonial.rating} out of 5`}
            >
              {Array.from({ length: Math.min(testimonial.rating, 5) }).map(
                (_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                )
              )}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pb-5">
        <blockquote className="text-sm leading-relaxed text-slate-700">
          &ldquo;{testimonial.message}&rdquo;
        </blockquote>
        <div>
          <p className="text-sm font-semibold text-navy">{testimonial.name}</p>
          <p className="text-xs capitalize text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}