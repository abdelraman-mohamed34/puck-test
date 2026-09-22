type TelemetryFields = Record<string, string | number | boolean | null | undefined>;

function emit(level: "info" | "warn" | "error", event: string, fields: TelemetryFields = {}) {
  const entry = { timestamp: new Date().toISOString(), service: "puck-test-renderer", event, ...fields };
  (level === "error" ? console.error : level === "warn" ? console.warn : console.info)(JSON.stringify(entry));
}

export function recordPreviewRejection(fields: TelemetryFields & { reason: string }) {
  emit("warn", "visual_builder.preview_message_rejected", fields);
}

export function recordUnsupportedComponent(fields: TelemetryFields & { componentType: string }) {
  emit("warn", "visual_builder.unsupported_component", fields);
}

export function recordWebhook(fields: TelemetryFields & { outcome: "success" | "failure" | "signature_rejected"; reason?: string }) {
  emit(fields.outcome === "success" ? "info" : "warn", "visual_builder.publish_webhook", fields);
}