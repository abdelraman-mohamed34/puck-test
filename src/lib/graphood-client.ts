import "server-only";
import { SiteDocumentV1Schema, fallbackDocument, type SiteDocumentV1 } from "@/lib/site-contract";

const memoryCache = new Map<string, SiteDocumentV1>();

type ResponseBody = { tenant?: string; data?: unknown; document?: unknown; publishedAt?: string | null };
function endpointFor(tenantSlug: string, pathname: string): URL {
  const base = process.env.GRAPHOOD_API_URL ?? process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL ?? "http://localhost:3000";
  const url = new URL(`/api/tenants/${encodeURIComponent(tenantSlug)}/site`, base);
  url.searchParams.set("path", pathname); return url;
}
function validate(value: unknown): SiteDocumentV1 | null {
  const parsed = SiteDocumentV1Schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
export async function getGraphoodPageDocument({ tenantSlug, pathname = "/", preview = false }: { tenantSlug: string; pathname?: string; preview?: boolean }): Promise<SiteDocumentV1> {
  const key = `${tenantSlug}:${pathname}`;
  try {
    const response = await fetch(endpointFor(tenantSlug, pathname), { headers: { Accept: "application/json" }, cache: preview ? "no-store" : "force-cache", next: preview ? undefined : { revalidate: 60 } });
    if (!response.ok) throw new Error(`Graphood API returned ${response.status}`);
    const body = await response.json() as ResponseBody;
    const document = validate(body.document ?? body.data);
    if (!document) throw new Error("Graphood document failed SiteDocumentV1 validation");
    memoryCache.set(key, document); return document;
  } catch (error) {
    console.error("[Graphood document]", error);
    return memoryCache.get(key) ?? fallbackDocument;
  }
}
