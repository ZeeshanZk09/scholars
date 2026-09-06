import { Suspense, type ReactNode } from "react";
import { Toaster } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import SmoothScrollProvider from "@/providers/ScrollProvider";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster richColors position="top-right" />

      <Suspense fallback={null}>
        <SmoothScrollProvider />
      </Suspense>
    </div>
  );
}
