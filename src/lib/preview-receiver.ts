import { parsePreviewMessageV1, type PreviewMessageV1, isAllowedMessageOrigin, type SiteDocumentV1 } from "@/lib/site-contract";

export type PreviewReceiverOptions = {
  allowedEditorOrigins: readonly string[];
  tenantSlug: string;
  sessionId: string;
  nonce: string;
  currentRevision: number;
  onDocument: (document: SiteDocumentV1, message: Extract<PreviewMessageV1, { type: "PREVIEW_INIT" | "DOCUMENT_UPDATE" }>) => void;
  onRejected?: (reason: "origin" | "source" | "protocol" | "identity" | "stale_revision") => void;
};

export function receivePreviewMessage(event: MessageEvent<unknown>, options: PreviewReceiverOptions): boolean {
  if (event.source !== window.parent) { options.onRejected?.("source"); return false; }
  if (!isAllowedMessageOrigin(event.origin, options.allowedEditorOrigins)) { options.onRejected?.("origin"); return false; }
  const parsed = parsePreviewMessageV1(event.data);
  if (!parsed.success || !["PREVIEW_INIT", "DOCUMENT_UPDATE"].includes(parsed.data.type)) { options.onRejected?.("protocol"); return false; }
  const message = parsed.data as Extract<PreviewMessageV1, { type: "PREVIEW_INIT" | "DOCUMENT_UPDATE" }>;
  if (message.payload.tenantSlug !== options.tenantSlug || message.payload.sessionId !== options.sessionId || message.payload.nonce !== options.nonce) { options.onRejected?.("identity"); return false; }
  if (message.payload.revision < options.currentRevision) { options.onRejected?.("stale_revision"); return false; }
  options.onDocument(message.payload.document, message);
  return true;
}