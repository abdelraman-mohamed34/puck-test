import 'server-only';

import { createGraphoodClient } from './request';

export type PublishedTenantSite = {
    tenant: string;
    data: unknown;
    publishedAt: string | null;
};

export const graphoodServerClient = createGraphoodClient({
    baseUrl: process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL || process.env.GRAPHOOD_BASE_URL,
    apiKey: process.env.GRAPHOOD_SERVER_API_KEY,
    configNames: {
        baseUrl: 'GRAPHOOD_BASE_URL',
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
    return graphoodServerClient.request<PublishedTenantSite | null>(
        `/api/tenants/${encodeURIComponent(normalizedSlug)}/site?${query.toString()}`,
        { cache: 'no-store' },
    );
}
