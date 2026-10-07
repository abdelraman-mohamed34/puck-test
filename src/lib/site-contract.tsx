import { z } from "zod";
import type { Config, Data } from "@measured/puck";
import { Hero, TextSection, FeatureGrid } from "./components";

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
    { type: "Hero", id: "hero-1", props: { title: "مرحباً بك في متجرنا", description: "نوفر لك أفضل المنتجات بأسعار تنافسية وجودة عالية", buttonLabel: "تصفح المنتجات", buttonUrl: "/products", backgroundColor: "#0F172A", textColor: "#F8FAFC" } },
    { type: "TextSection", id: "text-1", props: { title: "تجربة تسوق مميزة", body: "استمتع بتجربة تسوق سهلة وآمنة مع خيارات دفع متعددة وشحن سريع.", alignment: "center" } },
    { type: "FeatureGrid", id: "features-1", props: { title: "مميزاتنا", items: [{ title: "شحن مجاني", description: "شحن مجاني للطلبات فوق 200 ريال" }, { title: "دفع آمن", description: "خيارات دفع متعددة وآمنة 100%" }] } },
  ],
};

export const sharedConfig: Config = {
  components: {
    Hero: Hero,
    TextSection: TextSection,
    FeatureGrid: FeatureGrid,
  },
};

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