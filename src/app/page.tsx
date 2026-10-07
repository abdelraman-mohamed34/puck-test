"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenantSlug } from "./shared/lib/providers/providers";
import { getPublishedTenantSite } from "./shared/lib/graphood/client";
import { Render, type Data } from "@measured/puck";
import config from "@/mock/puck/puck.config";

export default function Home() {
  const tenantSlug = useTenantSlug();

  const { data: publishedSite } = useQuery({
    queryKey: ["graphood", "published-site", tenantSlug],
    queryFn: () => getPublishedTenantSite(tenantSlug ?? ""),
    enabled: Boolean(tenantSlug),
  });

  const publishedContent = (publishedSite?.data ?? { content: [], root: { props: {} } }) as Data;

  return <Render config={config} data={publishedContent} />
}
