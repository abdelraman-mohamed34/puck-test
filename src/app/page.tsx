import { draftMode, headers } from "next/headers";

import { GraphoodRenderer } from "@/components/graphood/renderer";
import { getGraphoodPageLayout, type GraphoodLayout } from "@/lib/graphood-client";

export default async function Home() {
  const [headerList, draft] = await Promise.all([headers(), draftMode()]);
  const tenantSlug = headerList.get("x-tenant-slug") ?? process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG ?? "sandbox";
  let layout: GraphoodLayout = { content: [] };

  try {
    layout = await getGraphoodPageLayout({ tenantSlug, preview: draft.isEnabled });
  } catch (error) {
    console.error("[Graphood layout]", error);
  }

  return <main className="min-h-screen bg-background text-foreground antialiased"><GraphoodRenderer layout={layout} preview={draft.isEnabled} /></main>;
}
