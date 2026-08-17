"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createContactMessageSchema,
  type CreateContactMessageInput,
} from "@/schemas/contact/contact.schema";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateContactMessageInput>({
    resolver: zodResolver(createContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: CreateContactMessageInput) {
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body?.error?.message ??
          body?.message ??
          "Failed to send your message.";
        toast.error(message);
        return;
      }

      toast.success("Message sent successfully! We will get back to you soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <Input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name *</Label>
          <Input
            id="contact-name"
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            placeholder="e.g. 0300 1234567"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            disabled={isSubmitting}
            {...register("phone")}
          />
          {errors.phone ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input
            id="contact-subject"
            placeholder="What is this about?"
            aria-invalid={Boolean(errors.subject)}
            disabled={isSubmitting}
            {...register("subject")}
          />
          {errors.subject ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.subject.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="Write your message to Scholar"
          aria-invalid={Boolean(errors.message)}
          disabled={isSubmitting}
          {...register("message")}
        />
        {errors.message ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
