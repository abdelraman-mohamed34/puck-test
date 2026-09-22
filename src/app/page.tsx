import { draftMode, headers } from "next/headers";
import { GraphoodRenderer } from "@/components/graphood/renderer";
import { getGraphoodPageDocument } from "@/lib/graphood-client";

export default async function Home() {
  const [headerList, draft] = await Promise.all([headers(), draftMode()]);
  const tenantSlug = headerList.get("x-tenant-slug") ?? process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG ?? "sandbox";
  const document = await getGraphoodPageDocument({ tenantSlug, preview: draft.isEnabled });
  return <main className="min-h-screen bg-background text-foreground antialiased"><GraphoodRenderer document={document} preview={draft.isEnabled} /></main>;
}
