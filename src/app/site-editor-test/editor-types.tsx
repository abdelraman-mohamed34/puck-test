import { z } from "zod";
import type { Config, Data } from "@measured/puck";

const itemSchema = z.object({ title: z.string(), description: z.string() });
const componentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("Hero"), id: z.string().min(1), props: z.object({ title: z.string(), description: z.string(), buttonLabel: z.string(), buttonUrl: z.string(), backgroundColor: z.string(), textColor: z.string() }) }),
  z.object({ type: z.literal("TextSection"), id: z.string().min(1), props: z.object({ title: z.string(), body: z.string(), alignment: z.enum(["left", "center", "right"]) }) }),
  z.object({ type: z.literal("FeatureGrid"), id: z.string().min(1), props: z.object({ title: z.string(), items: z.array(itemSchema) }) }),
]);

export const puckDocumentSchema = z.object({
  content: z.array(componentSchema),
  root: z.object({ props: z.record(z.string(), z.unknown()).optional() }).default({}),
});

export type SiteDocument = z.infer<typeof puckDocumentSchema>;
export type SiteData = Data;

export const fallbackDocument: SiteDocument = {
  root: { props: {} },
  content: [
    { type: "Hero", id: "hero-1", props: { title: "Suty test site", description: "A small Graphood-connected page experiment.", buttonLabel: "Explore", buttonUrl: "#features", backgroundColor: "#172554", textColor: "#ffffff" } },
    { type: "TextSection", id: "text-1", props: { title: "Connected editing", body: "Edit this document in Puck and watch the preview update instantly.", alignment: "center" } },
    { type: "FeatureGrid", id: "features-1", props: { title: "Features", items: [{ title: "Drafts", description: "Save work without publishing." }, { title: "Preview", description: "See the same components in an iframe." }] } },
  ],
};

export const config: Config = {
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
    return { ...item, id };
  }) };
}
