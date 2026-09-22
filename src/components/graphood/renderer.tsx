"use client";

import { useEffect, useState } from "react";
import { Render } from "@measured/puck";
import { fallbackDocument, normalizeDocument, sharedConfig, type SiteDocument } from "@/lib/site-contract";
import "@measured/puck/puck.css";
import { receivePreviewMessage } from "@/lib/preview-receiver";
import { recordPreviewRejection, recordUnsupportedComponent } from "@/lib/telemetry";

export function GraphoodRenderer({ document, preview = false, tenantSlug = "sandbox", sessionId = "", nonce = "" }: { document: SiteDocument; preview?: boolean; tenantSlug?: string; sessionId?: string; nonce?: string }) {
  const [current, setCurrent] = useState(() => normalizeDocument(document));
  useEffect(() => {
    for (const block of current.content) {
      if (block.type === "Unsupported") {
        recordUnsupportedComponent({ componentType: String(block.props.type ?? "unknown") });
      }
    }
  }, [current.content]);
  useEffect(() => {
    if (!preview || !sessionId || !nonce) return;
    const onMessage = (event: MessageEvent<unknown>) => receivePreviewMessage(event, {
      allowedEditorOrigins: [window.location.origin, "https://app.graphood.com", "https://graphood.com", "http://localhost:3000"],
      tenantSlug,
      sessionId,
      nonce,
      currentRevision: 0,
      onRejected: (reason) => recordPreviewRejection({ reason, tenantSlug }),
      onDocument: (next) => setCurrent(normalizeDocument(next)),
    });
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [nonce, preview, sessionId, tenantSlug]);
  return <Render config={sharedConfig} data={current} />;
}

export { fallbackDocument };
