import "server-only";

export type GraphoodBlock = {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
};

export type GraphoodLayout = {
  content?: GraphoodBlock[];
  root?: Record<string, unknown>;
};

type GraphoodPageResponse = {
  draft_data?: unknown;
  published_data?: unknown;
  layout?: unknown;
  data?: unknown;
};

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required Graphood configuration: ${name}`);
  return value;
}

function endpointFor(tenantSlug: string, pathname: string): URL {
  const baseUrl = process.env.GRAPHOOD_API_URL ?? requiredEnvironment("NEXT_PUBLIC_GRAPHOOD_BASE_URL");
  const encodedTenant = encodeURIComponent(tenantSlug);
  const template = process.env.GRAPHOOD_PAGE_LAYOUT_ENDPOINT;
  const endpoint = template
    ? template.replace(":tenantSlug", encodedTenant)
    : `/api/v1/tenants/${encodedTenant}/pages`;
  const url = new URL(endpoint, baseUrl);
  url.searchParams.set("path", pathname);
  return url;
}

function extractLayout(response: GraphoodPageResponse, preview: boolean): GraphoodLayout {
  const selected = preview ? response.draft_data : response.published_data;
  const layout = selected ?? response.layout ?? response.data;

  if (!layout || typeof layout !== "object") return { content: [] };
  return layout as GraphoodLayout;
}

export async function getGraphoodPageLayout({
  tenantSlug,
  pathname = "/",
  preview = false,
}: {
  tenantSlug: string;
  pathname?: string;
  preview?: boolean;
}): Promise<GraphoodLayout> {
  if (!tenantSlug) return { content: [] };

  const response = await fetch(endpointFor(tenantSlug, pathname), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${requiredEnvironment("GRAPHOOD_SERVER_API_KEY")}`,
      ...(preview ? { "X-Graphood-Preview": "draft" } : {}),
    },
    cache: preview ? "no-store" : "force-cache",
    next: preview ? undefined : { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Graphood page request failed: ${response.status} ${response.statusText}`);
  }

  return extractLayout((await response.json()) as GraphoodPageResponse, preview);
}
