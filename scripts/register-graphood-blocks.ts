type JsonSchema = Record<string, unknown>;

const textField = (title: string, defaultValue = ""): JsonSchema => ({ type: "string", title, default: defaultValue, "x-graphood-field": "text" });
const colorField = (title: string, defaultValue: string): JsonSchema => ({ type: "string", title, default: defaultValue, format: "color", "x-graphood-field": "color" });
const selectField = (title: string, options: string[], defaultValue: string): JsonSchema => ({ type: "string", title, enum: options, default: defaultValue, "x-graphood-field": "select" });

export const graphoodBlocks = [
  {
    type: "HeroBlock",
    displayName: "Hero",
    permissions: { allowDrag: false },
    schema: { type: "object", properties: { title: textField("Title", "Welcome"), subtitle: textField("Subtitle"), ctaText: textField("CTA label"), ctaLink: textField("CTA URL", "#"), alignment: selectField("Alignment", ["left", "center", "right"], "center"), backgroundColor: colorField("Background", "#164e63"), textColor: colorField("Text color", "#ffffff") }, required: ["title"] },
  },
  {
    type: "ProductsGrid",
    displayName: "Products grid",
    permissions: { allowDrag: true },
    schema: { type: "object", properties: { title: textField("Heading", "Featured products"), columns: { type: "number", title: "Columns", default: 3, minimum: 1, maximum: 4, "x-graphood-field": "number" }, backgroundColor: colorField("Background", "#ffffff"), products: { type: "array", title: "Products", items: { type: "object", properties: { title: textField("Title"), description: textField("Description"), price: textField("Price") } } } } },
  },
  {
    type: "PromoBanner",
    displayName: "Promo banner",
    permissions: { allowDrag: true },
    schema: { type: "object", properties: { text: textField("Text", "Free delivery on orders over $50"), linkLabel: textField("Link label"), linkUrl: textField("Link URL", "#"), alignment: selectField("Alignment", ["left", "center", "right"], "center"), backgroundColor: colorField("Background", "#fef3c7"), textColor: colorField("Text color", "#1f2937") }, required: ["text"] },
  },
];

export async function registerGraphoodBlocks() {
  const apiUrl = process.env.GRAPHOOD_API_URL;
  const tenantSlug = process.env.TENANT_SLUG;
  const apiKey = process.env.GRAPHOOD_SERVER_API_KEY;
  if (!apiUrl || !tenantSlug || !apiKey) throw new Error("GRAPHOOD_API_URL, TENANT_SLUG, and GRAPHOOD_SERVER_API_KEY are required.");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/tenants/${encodeURIComponent(tenantSlug)}/blocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ blocks: graphoodBlocks }),
  });
  if (!response.ok) throw new Error(`Graphood block registration failed: ${response.status} ${await response.text()}`);
  return response.json();
}

if (process.argv[1]?.endsWith("register-graphood-blocks.ts")) {
  registerGraphoodBlocks().then(() => console.log("Graphood blocks registered.")).catch((error: unknown) => { console.error(error); process.exitCode = 1; });
}
