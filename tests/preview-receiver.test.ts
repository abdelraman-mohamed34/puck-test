import { receivePreviewMessage } from "@/lib/preview-receiver";
import { fallbackDocument } from "@/lib/site-contract";

const payload = { version: 1 as const, type: "DOCUMENT_UPDATE" as const, payload: { tenantSlug: "tenant-a", pagePath: "/", sessionId: "session", nonce: "nonce", revision: 3, document: fallbackDocument } };

describe("PUCK-TEST preview receiver", () => {
  beforeEach(() => { Object.assign(window, { parent: window }); });
  it.each([
    ["origin", "https://evil.example", payload],
    ["identity", "https://app.graphood.com", { ...payload, payload: { ...payload.payload, nonce: "bad" } }],
    ["stale_revision", "https://app.graphood.com", { ...payload, payload: { ...payload.payload, revision: 1 } }],
  ])("rejects %s", (reason, origin, data) => {
    const rejected = jest.fn();
    const applied = jest.fn();
    const result = receivePreviewMessage({ source: window.parent, origin, data } as MessageEvent, { allowedEditorOrigins: ["https://app.graphood.com"], tenantSlug: "tenant-a", sessionId: "session", nonce: "nonce", currentRevision: 2, onDocument: applied, onRejected: rejected });
    expect(result).toBe(false);
    expect(rejected).toHaveBeenCalledWith(reason);
    expect(applied).not.toHaveBeenCalled();
  });
});