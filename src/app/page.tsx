'use client';

import { useEffect, useMemo, useState } from "react";
import { Render } from "@measured/puck";
import { useGraphood } from "./shared/lib/graphood/hooks/use-graphood";
import { useTenantSlug } from "./shared/lib/providers/providers";
import { normalizeTenantSiteDocument } from "./shared/lib/tenant-site/types";
import { tenantSiteConfig } from "./shared/lib/tenant-site/config";

export default function Home() {
  const rawTenantSlug = useTenantSlug();
  const tenantSlug = rawTenantSlug ?? "";

  const { tenant, isLoading } = useGraphood({ tenantSlug });

  const fallbackSiteData = useMemo(() => normalizeTenantSiteDocument({
    content: [
      { type: "Hero", props: { id: "hero-1", title: `مرحباً بك في ${tenant?.data?.tenant?.name ?? "متجرنا"}`, subtitle: "نحن نقدم أفضل المنتجات والخدمات التي تلبي احتياجاتك بأعلى جودة.", ctaText: "تصفح المنتجات", ctaLink: "#products" } },
      { type: "FeatureGrid", props: { id: "features-1", title: "لماذا تختار متجرنا؟", features: [{ heading: "شحن سريع", description: "توصيل سريع وفعال لكافة المحافظات." }, { heading: "دفع آمن", description: "خيارات دفع متعددة وآمنة تماماً." }, { heading: "جودة مضمونة", description: "منتجات صممت واختيرت بعناية فائقة." }] } },
    ],
    root: {},
  }), [tenant?.data?.tenant?.name]);

  const [siteData, setSiteData] = useState(fallbackSiteData);

  useEffect(() => {
    if (tenant?.data) {
      const siteDataFromTenant = (tenant.data as unknown as { site_data?: unknown }).site_data;
      const normalized = normalizeTenantSiteDocument(siteDataFromTenant);
      queueMicrotask(() => setSiteData(normalized.content.length > 0 ? normalized : fallbackSiteData));
    }
  }, [tenant, fallbackSiteData]);

  useEffect(() => {
    const isAllowedOrigin = (origin: string) => {
      if (!origin) return false;
      if (origin === window.location.origin) return true;

      try {
        const { protocol, hostname } = new URL(origin);
        const isLocal = protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1");
        const isGraphood = protocol === "https:" && (hostname === "graphood.com" || hostname.endsWith(".graphood.com"));
        const isVercel = protocol === "https:" && (hostname === "vercel.app" || hostname.endsWith(".vercel.app"));
        return isLocal || isGraphood || isVercel;
      } catch {
        return false;
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PUCK_PREVIEW_UPDATE" || !isAllowedOrigin(event.origin)) return;
      if (window.parent !== window && event.source !== window.parent) return;
      setSiteData(normalizeTenantSiteDocument(event.data.data));
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground antialiased px-4 max-w-5xl mx-auto">
      <Render config={tenantSiteConfig} data={siteData} />
    </main>
  );
}
