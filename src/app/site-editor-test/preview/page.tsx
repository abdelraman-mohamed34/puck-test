"use client";
import { useEffect, useState } from "react";
import { Render } from "@measured/puck";
import { config, fallbackDocument, normalizeDocument, type SiteDocument } from "../editor-types";
import "@measured/puck/puck.css";
export default function SitePreview() { const [document, setDocument] = useState<SiteDocument>(fallbackDocument); useEffect(() => { window.parent.postMessage({ type: "TENANT_SITE_READY" }, window.location.origin); const onMessage = (event: MessageEvent) => { if (event.origin !== window.location.origin || event.data?.type !== "TENANT_SITE_UPDATE") return; const next = normalizeDocument(event.data.document); setDocument(next); }; window.addEventListener("message", onMessage); return () => window.removeEventListener("message", onMessage); }, []); return <div className="preview-page"><Render config={config} data={document} /></div>; }
