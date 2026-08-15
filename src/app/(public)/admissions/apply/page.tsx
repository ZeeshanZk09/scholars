import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissionsService } from "@/services/admissions";
import { siteConfig } from "@/lib/site-config";

const AdmissionApplyForm = dynamic(() =>
  import("@/components/forms/admission-apply-form").then((mod) => mod.AdmissionApplyForm)
);

export const metadata: Metadata = {
  title: "Apply for Admission",
  description:
    "Submit your admission application to Scholar — school, college, coaching or computer courses.",
  alternates: {
    canonical: "/admissions/apply",
  },
};

export const revalidate = 300;

export default async function AdmissionApplyPage() {
  const admissions = new AdmissionsService();
  const periods = await admissions.listPeriods({ skip: 0, take: 50 });

  const openPeriod = periods.items.find((period) => period.status === "OPEN");

  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title="Apply for Admission"
        description="Fill in the application form below and our admissions team will contact you with the next steps."
        crumbs={[{ label: "Admissions", href: "/admissions" }, { label: "Apply" }]}
      />

      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              {openPeriod ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-navy">Application Form</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Fields marked with * are required.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <AdmissionApplyForm periodId={openPeriod.id} />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="space-y-4 py-8 text-center">
                    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Applications Closed
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-navy">
                        Admissions are currently closed
                      </h2>
                      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        We are not accepting applications right now. New admission periods will be
                        announced here — check back soon or contact the admissions office for the
                        upcoming schedule.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl bg-navy p-8 text-white">
                <h2 className="text-xl font-bold">What Happens Next?</h2>
                <ol className="mt-6 space-y-4 text-sm">
                  {[
                    "Our admissions team reviews your application.",
                    "We call or email you to confirm the details.",
                    "You submit the required documents.",
                    "Your seat is confirmed once the admission fee is paid.",
                  ].map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Contact the admissions office:</p>
                  <p>
                    <a
                      href={`tel:${siteConfig.phoneHref}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {siteConfig.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
