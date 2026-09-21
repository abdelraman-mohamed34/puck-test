import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { dehydrate } from "@tanstack/react-query";

import "./globals.css";

import Providers from "./shared/lib/providers/providers";
import { getQueryClient } from "./shared/lib/react-query/get-query-client";
import {
  checkGraphoodHealth,
  getMemberships,
  getTenantDetails,
} from "./shared/lib/graphood/services";
import { graphoodServerClient } from "./shared/lib/graphood/server";
import { graphoodQueryKeys } from "./shared/lib/graphood/query-keys";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TENANT_SLUG_PATTERN = /^[a-z0-9-]{3,100}$/;

function normalizeTenantSlug(value: string | null): string | null {
  const slug = value?.trim().toLowerCase() ?? "";
  return TENANT_SLUG_PATTERN.test(slug) ? slug : null;
}

function resolveTenantSlug(headersList: Headers): string | null {
  const forwardedHost = headersList.get("x-graphood-original-host")
    ?? headersList.get("x-forwarded-host");
  const host = forwardedHost?.split(",")[0]?.trim().split(":")[0].toLowerCase();
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
    .replace(/^https?:\/\//, "")
    .split(":")[0]
    .toLowerCase();
  const fromHost = host?.endsWith(`.${rootDomain}`)
    ? normalizeTenantSlug(host.slice(0, -(rootDomain.length + 1)))
    : null;

  return normalizeTenantSlug(headersList.get("x-tenant-slug")) ?? fromHost;
}

export const metadata: Metadata = {
  title: "Graphood Market",
  description: "Multi-tenant Platform",
};

function TenantNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 text-center text-slate-800">
      <div role="status">
        <h1 className="text-4xl font-bold text-slate-900">Tenant Not Found</h1>
        <p className="mt-3 text-base text-slate-600">
          This tenant does not exist or is not active.
        </p>
      </div>
    </main>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();

  const tenantSlug = resolveTenantSlug(headersList);
  if (!tenantSlug) {
    return <RootDocument><TenantNotFound /></RootDocument>;
  }

  const queryClient = getQueryClient();

  let tenantData: Awaited<ReturnType<typeof getTenantDetails>> | null = null;

  try {
    tenantData = await queryClient.fetchQuery({
      queryKey: graphoodQueryKeys.tenant(tenantSlug),
      queryFn: () => getTenantDetails(tenantSlug, graphoodServerClient),
    });
  } catch (error) {
    console.error(`[Tenant Resolution] Failed for "${tenantSlug}"`, error);
  }

  const tenant = tenantData?.data.tenant;
  const isValidTenant = Boolean(
    tenantData?.success &&
    tenant?.id &&
    tenant?.slug === tenantSlug &&
    tenant?.status === "ACTIVE"
  );

  if (!isValidTenant) {
    return <RootDocument><TenantNotFound /></RootDocument>;
  }

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: graphoodQueryKeys.health,
      queryFn: () => checkGraphoodHealth(graphoodServerClient),
    }),
    queryClient.prefetchQuery({
      queryKey: graphoodQueryKeys.memberships(tenantSlug),
      queryFn: () => getMemberships(tenantSlug, graphoodServerClient),
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <RootDocument>
      <Providers dehydratedState={dehydratedState} tenantSlug={tenantSlug}>
        {children}
      </Providers>
    </RootDocument>
  );
}
