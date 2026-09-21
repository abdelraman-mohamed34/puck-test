import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TENANT_SLUG_PATTERN = /^[a-z0-9-]{3,100}$/;

function normalizeTenantSlug(value: string | null): string | null {
    const slug = value?.trim().toLowerCase() ?? "";
    return TENANT_SLUG_PATTERN.test(slug) ? slug : null;
}

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const hostHeader =
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
        request.headers.get("host") ||
        "";

    const hostname = hostHeader.replace(/^\[|\](:\d+)?$/g, "").split(":")[0].toLowerCase();
    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
        .replace(/^https?:\/\//, "")
        .split(":")[0]
        .toLowerCase();
    const isPlatformHost = new Set([
        rootDomain,
        `www.${rootDomain}`,
        `app.${rootDomain}`,
        "localhost",
        "127.0.0.1",
        "::1",
    ]).has(hostname);

    const querySlug = normalizeTenantSlug(url.searchParams.get("tenantSlug"));

    // A tenant header is accepted only on non-platform hosts. This preserves
    // the reverse-proxy contract without allowing platform-host spoofing.
    const headerSlug = isPlatformHost
        ? null
        : normalizeTenantSlug(request.headers.get("x-tenant-slug"));
    let tenantSlug = querySlug ?? headerSlug;

    if (!tenantSlug && isPlatformHost) {
        tenantSlug = normalizeTenantSlug(process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || "sandbox");
    } else if (hostname.endsWith(`.${rootDomain}`)) {
        tenantSlug = normalizeTenantSlug(hostname.slice(0, -(rootDomain.length + 1)));
    }

    const isAssetOrApi =
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/api") ||
        url.pathname.includes(".");

    if (!tenantSlug || (isAssetOrApi && isPlatformHost)) {
        return NextResponse.next();
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-slug", tenantSlug);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/((?!_vercel).*)"],
};
