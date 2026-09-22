import { z } from "zod";
import type { Config, Data } from "@measured/puck";

const componentSchema = z.object({ type: z.string().min(1), id: z.string().min(1), props: z.record(z.string(), z.unknown()) }).strict();

export const puckDocumentSchema = z.object({
  version: z.literal(1).default(1),
  content: z.array(componentSchema),
  root: z.object({ props: z.record(z.string(), z.unknown()).optional() }).default({}),
});

export type SiteDocument = z.infer<typeof puckDocumentSchema>;
export type SiteData = Data;
export const SiteDocumentV1Schema = puckDocumentSchema;
export type SiteDocumentV1 = SiteDocument;

export const fallbackDocument: SiteDocument = {
  version: 1,
  root: { props: {} },
  content: [
    { type: "Hero", id: "hero-1", props: { title: "Suty test site", description: "A small Graphood-connected page experiment.", buttonLabel: "Explore", buttonUrl: "#features", backgroundColor: "#172554", textColor: "#ffffff" } },
    { type: "TextSection", id: "text-1", props: { title: "Connected editing", body: "Edit this document in Puck and watch the preview update instantly.", alignment: "center" } },
    { type: "FeatureGrid", id: "features-1", props: { title: "Features", items: [{ title: "Drafts", description: "Save work without publishing." }, { title: "Preview", description: "See the same components in an iframe." }] } },
  ],
};

export const sharedConfig: Config = {
  components: {
    Hero: {
      fields: { title: { type: "text" }, description: { type: "textarea" }, buttonLabel: { type: "text" }, buttonUrl: { type: "text" }, backgroundColor: { type: "text" }, textColor: { type: "text" } },
      defaultProps: fallbackDocument.content[0].props,
      render: (props) => <Hero {...(props as unknown as Parameters<typeof Hero>[0])} />,
    },
    TextSection: {
      fields: { title: { type: "text" }, body: { type: "textarea" }, alignment: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } },
      defaultProps: fallbackDocument.content[1].props,
      render: (props) => <TextSection {...(props as unknown as Parameters<typeof TextSection>[0])} />,
    },
    FeatureGrid: {
      fields: { title: { type: "text" }, items: { type: "array", arrayFields: { title: { type: "text" }, description: { type: "textarea" } } } },
      defaultProps: fallbackDocument.content[2].props,
      render: (props) => <FeatureGrid {...(props as unknown as Parameters<typeof FeatureGrid>[0])} />,
    },
  },
};

export function Hero({ title, description, buttonLabel, buttonUrl, backgroundColor, textColor }: { title: string; description: string; buttonLabel: string; buttonUrl: string; backgroundColor: string; textColor: string; id?: string; puck?: unknown; editMode?: boolean }) {
  return <section style={{ backgroundColor, color: textColor }} className="preview-hero"><h1>{title}</h1><p>{description}</p><a href={buttonUrl || "#"} onClick={(event) => event.preventDefault()}>{buttonLabel}</a></section>;
}
export function TextSection({ title, body, alignment }: { title: string; body: string; alignment: string; id?: string; puck?: unknown; editMode?: boolean }) {
  return <section className="preview-text" style={{ textAlign: alignment as "left" | "center" | "right" }}><h2>{title}</h2><p>{body}</p></section>;
}
export function FeatureGrid({ title, items }: { title: string; items: Array<{ title: string; description: string }>; id?: string; puck?: unknown; editMode?: boolean }) {
  return <section className="preview-features"><h2>{title}</h2><div className="preview-grid">{items.map((item, index) => <article key={`${item.title}-${index}`}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>;
}

export function normalizeDocument(value: unknown): SiteDocument {
  const parsed = puckDocumentSchema.safeParse(value);
  if (!parsed.success) return fallbackDocument;
  const ids = new Set<string>();
  return { ...parsed.data, content: parsed.data.content.map((item, index) => {
    const base = item.id || `${item.type.toLowerCase()}-${index + 1}`;
    let id = base; let suffix = 2;
    while (ids.has(id)) id = `${base}-${suffix++}`;
    ids.add(id);
    return { ...item, type: ["Hero", "TextSection", "FeatureGrid", "Unsupported"].includes(item.type) ? item.type : "Unsupported", id, props: ["Hero", "TextSection", "FeatureGrid"].includes(item.type) ? item.props : { type: item.type } };
  }) };
}











export type PreviewMessageV1 =
  | { version: 1; type: "PREVIEW_INIT" | "DOCUMENT_UPDATE"; payload: { tenantSlug: string; pagePath: string; sessionId: string; nonce: string; revision: number; document: SiteDocumentV1 } };

export function parsePreviewMessageV1(value: unknown) {
  const parsed = z.object({
    version: z.literal(1),
    type: z.enum(["PREVIEW_INIT", "DOCUMENT_UPDATE"]),
    payload: z.object({
      tenantSlug: z.string().min(1), pagePath: z.string().startsWith("/"), sessionId: z.string().min(1), nonce: z.string().min(1), revision: z.number().int().nonnegative(), document: puckDocumentSchema,
    }).strict(),
  }).strict().safeParse(value);
  return parsed as { success: true; data: PreviewMessageV1 } | { success: false; error: unknown };
}

export function isAllowedMessageOrigin(origin: string, allowedOrigins: readonly string[]) {
  try {
    const candidate = new URL(origin);
    return allowedOrigins.some((allowed) => new URL(allowed).origin === candidate.origin);
  } catch { return false; }
}