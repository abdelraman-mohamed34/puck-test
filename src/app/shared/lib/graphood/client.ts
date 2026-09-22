import 'client-only';

import { createGraphoodClient } from './request';

export type PublishedTenantSite = {
    tenant: string;
    data: unknown;
    publishedAt: string | null;
};

export const graphoodClient = createGraphoodClient({
    baseUrl: process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL,
    // Developer API credentials must never be bundled into browser code.
    apiKey: undefined,
    configNames: {
        baseUrl: 'NEXT_PUBLIC_GRAPHOOD_BASE_URL',
        apiKey: 'GRAPHOOD_SERVER_API_KEY',
    },
});

export async function getPublishedTenantSite(
    tenantSlug: string,
    pathname = '/',
): Promise<PublishedTenantSite | null> {
    const normalizedSlug = tenantSlug.trim().toLowerCase();
    if (!normalizedSlug) return null;

    const query = new URLSearchParams({ path: pathname });
    return graphoodClient.request<PublishedTenantSite | null>(
        `/api/tenants/${encodeURIComponent(normalizedSlug)}/site?${query.toString()}`,
        { cache: 'no-store' },
    );
}
