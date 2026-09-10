"use client";

import { useEffect, useState } from "react";

import type { GraphoodBlock, GraphoodLayout } from "@/lib/graphood-client";

type Props = Record<string, unknown>;

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function number(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function HeroBlock({ title, subtitle, ctaText, ctaLink, backgroundColor, textColor }: Props) {
  return (
    <section style={{ background: text(backgroundColor, "#164e63"), color: text(textColor, "#ffffff"), padding: "5rem 1.5rem", textAlign: "center" }}>
      <h1 style={{ margin: 0, fontSize: "2.5rem" }}>{text(title, "Your headline")}</h1>
      {text(subtitle) && <p style={{ margin: "1rem auto 1.5rem", maxWidth: 680 }}>{text(subtitle)}</p>}
      {text(ctaText) && <a href={text(ctaLink, "#")} style={{ color: "inherit" }}>{text(ctaText)}</a>}
    </section>
  );
}

function ProductsGrid({ title, columns, products, backgroundColor }: Props) {
  const items = Array.isArray(products) ? products.filter((item): item is Props => typeof item === "object" && item !== null) : [];
  const columnCount = Math.min(Math.max(number(columns, 3), 1), 4);
  return (
    <section style={{ background: text(backgroundColor, "#ffffff"), padding: "3rem 1.5rem" }}>
      {text(title) && <h2>{text(title)}</h2>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: "1rem" }}>
        {items.map((product, index) => <article key={`${text(product.id, "product")}-${index}`} style={{ border: "1px solid #d1d5db", padding: "1rem" }}><h3>{text(product.title, "Product")}</h3><p>{text(product.description)}</p><strong>{text(product.price)}</strong></article>)}
      </div>
    </section>
  );
}

function PromoBanner({ text: message, linkLabel, linkUrl, backgroundColor, textColor }: Props) {
  return <aside style={{ background: text(backgroundColor, "#fef3c7"), color: text(textColor, "#1f2937"), padding: "1rem 1.5rem", textAlign: "center" }}><span>{text(message)}</span>{text(linkLabel) && <> <a href={text(linkUrl, "#")} style={{ color: "inherit" }}>{text(linkLabel)}</a></>}</aside>;
}

function UnsupportedBlock({ block }: { block: GraphoodBlock }) {
  return <section data-graphood-unsupported-block={block.type} role="status" style={{ border: "1px dashed #9ca3af", color: "#4b5563", margin: "1rem", padding: "1rem" }}>Unsupported Graphood block: {block.type}</section>;
}

const blockComponents: Record<string, (props: Props) => React.ReactNode> = {
  HeroBlock,
  ProductsGrid,
  PromoBanner,
};

function documentFrom(value: unknown): GraphoodLayout | null {
  if (Array.isArray(value)) return { content: value as GraphoodBlock[] };
  if (!value || typeof value !== "object") return null;
  const candidate = value as { layout?: unknown; data?: unknown; content?: unknown };
  if (Array.isArray(candidate.content)) return candidate as GraphoodLayout;
  return documentFrom(candidate.layout ?? candidate.data);
}

function allowedMessageOrigin(origin: string): boolean {
  if (origin === window.location.origin) return true;
  const configured = process.env.NEXT_PUBLIC_GRAPHOOD_EDITOR_ORIGIN;
  if (configured && origin === configured) return true;
  try {
    const apiOrigin = new URL(process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL ?? "https://graphood.com").origin;
    return origin === apiOrigin || origin.endsWith(".graphood.com");
  } catch {
    return false;
  }
}

export function GraphoodRenderer({ layout, preview = false }: { layout: GraphoodLayout; preview?: boolean }) {
  const [currentLayout, setCurrentLayout] = useState(layout);

  useEffect(() => {
    if (!preview) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !allowedMessageOrigin(event.origin)) return;
      if (event.data?.type !== "GRAPHOOD_LAYOUT_UPDATE" && event.data?.type !== "PUCK_PREVIEW_UPDATE") return;
      const nextLayout = documentFrom(event.data.layout ?? event.data.data ?? event.data.document);
      if (nextLayout) setCurrentLayout(nextLayout);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [preview]);

  const blocks = Array.isArray(currentLayout.content) ? currentLayout.content : [];
  return <>{blocks.map((block, index) => {
    const Component = blockComponents[block.type];
    return Component ? <Component key={block.id ?? `${block.type}-${index}`} {...(block.props ?? {})} /> : <UnsupportedBlock key={block.id ?? `${block.type}-${index}`} block={block} />;
  })}</>;
}
