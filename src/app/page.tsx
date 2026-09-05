'use client';

import { Render } from "@measured/puck";
import { useGraphood } from "./shared/lib/graphood/hooks/use-graphood";
import { useTenantSlug } from "./shared/lib/providers/providers";
import { normalizeTenantSiteDocument } from "./shared/lib/tenant-site/types";
import { tenantSiteConfig } from "./shared/lib/tenant-site/config";

export default function Home() {
  const rawTenantSlug = useTenantSlug();
  const tenantSlug = rawTenantSlug ?? "";

  const { tenant, isLoading } = useGraphood({ tenantSlug });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  const siteData = normalizeTenantSiteDocument(
    (tenant?.data as unknown as { site_data?: unknown })?.site_data ?? {
      content: [
        {
          type: "Hero",
          props: {
            id: "hero-1",
            title: `مرحباً بك في ${tenant?.data?.tenant?.name ?? "متجرنا"}`,
            subtitle: "نحن نقدم أفضل المنتجات والخدمات التي تلبي احتياجاتك بأعلى جودة.",
            ctaText: "تصفح المنتجات",
            ctaLink: "#products",
          },
        },
        {
          type: "FeatureGrid",
          props: {
            id: "features-1",
            title: "لماذا تختار متجرنا؟",
            features: [
              { heading: "شحن سريع", description: "توصيل سريع وفعال لكافة المحافظات." },
              { heading: "دفع آمن", description: "خيارات دفع متعددة وآمنة تماماً." },
              { heading: "جودة مضمونة", description: "منتجات صممت واختيرت بعناية فائقة." },
            ],
          },
        },
      ],
      root: {},
    }
  );

  return (
    <main className="min-h-screen bg-background text-foreground antialiased px-4 max-w-5xl mx-auto">
      <Render config={tenantSiteConfig} data={siteData} />
    </main>
  );
}