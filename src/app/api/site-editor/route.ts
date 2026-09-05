import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { graphoodServerClient } from "@/app/shared/lib/graphood/server";
import { normalizeDocument, puckDocumentSchema } from "@/app/site-editor-test/editor-types";

const bodySchema = z.object({ tenantSlug: z.string().min(1), document: puckDocumentSchema.optional() });
const endpointFor = (action: "load" | "draft" | "publish") => process.env[`GRAPHOOD_SITE_${action.toUpperCase()}_ENDPOINT`];

async function proxy(action: "load" | "draft" | "publish", request: NextRequest) {
  const endpoint = endpointFor(action);
  if (!endpoint) return NextResponse.json({ error: `Missing GRAPHOOD_SITE_${action.toUpperCase()}_ENDPOINT configuration.` }, { status: 503 });
  const input = request.method === "GET" ? { tenantSlug: new URL(request.url).searchParams.get("tenantSlug") || "" } : await request.json();
  const parsed = bodySchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid tenant or document." }, { status: 400 });
  const payload = action === "load" ? undefined : { tenantSlug: parsed.data.tenantSlug, document: normalizeDocument(parsed.data.document) };
  try {
    const data = await graphoodServerClient.request(endpoint, { method: action === "load" ? "GET" : "POST", ...(payload ? { body: JSON.stringify(payload) } : {}), cache: "no-store" });
    return NextResponse.json(data);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Graphood request failed." }, { status: 502 }); }
}
export function GET(request: NextRequest) { return proxy("load", request); }
export function PUT(request: NextRequest) { return proxy("draft", request); }
export function POST(request: NextRequest) { return proxy("publish", request); }
