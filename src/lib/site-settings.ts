import { cache } from "react";

import { siteConfig } from "@/lib/site-config";
import { SiteSettingService } from "@/services/settings";

export type PublicSiteSettings = {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: string;
  applyUrl: string;
};

/**
 * Resolves public-facing site settings from the CMS-backed `SiteSetting`
 * store, falling back to the static `siteConfig` defaults when a key is
 * missing or the database is unreachable. CMS edits therefore surface on the
 * public website (footer, contact page, structured data).
 */
export const getSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const fallback: PublicSiteSettings = {
    name: siteConfig.name,
    fullName: siteConfig.fullName,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
    email: siteConfig.email,
    phone: siteConfig.phone,
    phoneHref: siteConfig.phoneHref,
    address: siteConfig.address,
    applyUrl: siteConfig.applyUrl,
  };

  try {
    const records = await new SiteSettingService().listForAdmin();
    const map = new Map(records.map((record) => [record.key, record.value ?? ""]));
    const pick = (key: keyof PublicSiteSettings, value: string): string =>
      map.get(key) || value;

    return {
      name: pick("name", fallback.name),
      fullName: pick("fullName", fallback.fullName),
      tagline: pick("tagline", fallback.tagline),
      description: pick("description", fallback.description),
      url: pick("url", fallback.url),
      locale: fallback.locale,
      email: pick("email", fallback.email),
      phone: pick("phone", fallback.phone),
      phoneHref: pick("phoneHref", fallback.phoneHref),
      address: pick("address", fallback.address),
      applyUrl: pick("applyUrl", fallback.applyUrl),
    };
  } catch {
    return fallback;
  }
});
