"use client";
import { useEffect, useState } from "react";
import { Render } from "@measured/puck";
import { fallbackDocument, normalizeDocument, sharedConfig, type SiteDocument } from "@/lib/site-contract";
import "@measured/puck/puck.css";
export default function SitePreview() {
  const [document, setDocument] = useState<SiteDocument>(fallbackDocument);
  useEffect(() => { window.parent.postMessage({ type: "TENANT_SITE_READY" }, window.location.origin); const onMessage = (event: MessageEvent) => { if (event.origin !== window.location.origin || event.data?.type !== "TENANT_SITE_UPDATE") return; setDocument(normalizeDocument(event.data.document)); }; window.addEventListener("message", onMessage); return () => window.removeEventListener("message", onMessage); }, []);
  return <div className="preview-page"><Render config={sharedConfig} data={document} /></div>;
}
