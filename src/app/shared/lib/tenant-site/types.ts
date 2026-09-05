import type { Data } from "@measured/puck";

export type TenantSiteDocument = Data;

export function normalizeTenantSiteDocument(data?: unknown): TenantSiteDocument {
    if (data && typeof data === "object" && "content" in data && Array.isArray((data as Data).content)) {
        return data as TenantSiteDocument;
    }

    return {
        content: [],
        root: {},
    };
}