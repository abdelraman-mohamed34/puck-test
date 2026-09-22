type GraphoodField = {
  type: "text" | "number" | "color" | "select";
  label: string;
  defaultValue?: string | number;
  options?: Array<{ label: string; value: string }>;
};

const textField = (label: string, defaultValue = ""): GraphoodField => ({ type: "text", label, defaultValue });
const colorField = (label: string, defaultValue: string): GraphoodField => ({ type: "color", label, defaultValue });
const selectField = (label: string, options: string[], defaultValue: string): GraphoodField => ({
  type: "select",
  label,
  defaultValue,
  options: options.map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })),
});

export const graphoodSchema = [
  {
    type: "Hero",
    label: "Hero",
    permissions: { allowDrag: true, allowDelete: true },
    fields: {
      eyebrow: textField("Eyebrow", "YOUR STORE"),
      title: textField("Title", "Welcome"),
      description: textField("Description"),
      buttonLabel: textField("Button label", "Shop now"),
      buttonUrl: textField("Button URL", "#products"),
      backgroundColor: colorField("Background", "#164e63"),
      textColor: colorField("Text color", "#ffffff"),
    },
  },
  {
    type: "TextSection",
    label: "Text section",
    permissions: { allowDrag: true, allowDelete: true },
    fields: {
      title: textField("Title", "Tell your story"),
      body: textField("Body"),
      align: selectField("Alignment", ["left", "center", "right"], "left"),
    },
  },
  {
    type: "FeatureGrid",
    label: "Feature grid",
    permissions: { allowDrag: true, allowDelete: true },
    fields: {
      title: textField("Title", "Why customers choose us"),
      items: textField("Items", "Quality | Carefully selected products"),
    },
  },
  {
    type: "CallToAction",
    label: "Call to action",
    permissions: { allowDrag: true, allowDelete: true },
    fields: {
      title: textField("Title", "Ready to get started?"),
      description: textField("Description"),
      buttonLabel: textField("Button label", "Contact us"),
      buttonUrl: textField("Button URL", "#contact"),
      backgroundColor: colorField("Background", "#f3f4f6"),
    },
  },
];

export async function registerGraphoodBlocks() {
  const apiUrl = process.env.GRAPHOOD_API_URL ?? process.env.GRAPHOOD_SERVER_BASE_URL ?? process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL;
  const tenantSlug = process.env.TENANT_SLUG;
  const apiKey = process.env.GRAPHOOD_SERVER_API_KEY;
  if (!apiUrl || !tenantSlug || !apiKey) throw new Error("GRAPHOOD_API_URL, TENANT_SLUG, and GRAPHOOD_SERVER_API_KEY are required.");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/tenants/${encodeURIComponent(tenantSlug)}/blocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ schema: graphoodSchema }),
  });
  if (!response.ok) throw new Error(`Graphood block registration failed: ${response.status} ${await response.text()}`);
  return response.json();
}

if (process.argv[1]?.endsWith("register-graphood-blocks.ts")) {
  registerGraphoodBlocks().then(() => console.log("Graphood blocks registered.")).catch((error: unknown) => { console.error(error); process.exitCode = 1; });
}
