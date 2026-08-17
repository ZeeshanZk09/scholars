import { Inter } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

import { JsonLd } from "@/components/seo/json-ld";
import { getSiteSettings } from "@/lib/site-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: settings.fullName,
      template: `%s | ${settings.fullName}`,
    },
    description: settings.description,
    openGraph: {
      type: "website",
      siteName: settings.fullName,
      url: settings.url,
      locale: settings.locale,
      title: settings.fullName,
      description: settings.description,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.fullName,
      description: settings.description,
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.fullName,
    url: settings.url,
    description: settings.description,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "PK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "customer service",
      email: settings.email,
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.fullName,
    url: settings.url,
  };

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {children}
      </body>
    </html>
  );
}
