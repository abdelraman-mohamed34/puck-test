import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { recordWebhook } from "@/lib/telemetry";

export const runtime = "nodejs";

const MAX_TIMESTAMP_AGE_SECONDS = 5 * 60;
const tenantSlugSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,100}$/);
const payloadSchema = z.object({
  tenantSlug: tenantSlugSchema,
  pagePath: z.string().startsWith("/").max(2_048).refine((value) => !value.startsWith("//")),
  publishedRevision: z.number().int().nonnegative(),
  publishedAt: z.string().datetime({ offset: true }),
}).strict();

function isFreshTimestamp(value: string): boolean {
  const timestamp = Number(value);
  if (!Number.isInteger(timestamp)) return false;
  return Math.abs(Math.floor(Date.now() / 1000) - timestamp) <= MAX_TIMESTAMP_AGE_SECONDS;
}

function isValidSignature(secret: string, timestamp: string, body: string, received: string): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(request: Request) {
  const secret = process.env.GRAPHOOD_WEBHOOK_SECRET?.trim();
  const signature = request.headers.get("x-graphood-signature")?.trim();
  const timestamp = request.headers.get("x-graphood-timestamp")?.trim();
  const event = request.headers.get("x-graphood-event")?.trim();

  if (!secret || !signature || !timestamp || event !== "site.published") {
    recordWebhook({ outcome: "signature_rejected", reason: "missing_headers" });
    return NextResponse.json({ error: "Invalid webhook authentication." }, { status: 401 });
  }

  if (!isFreshTimestamp(timestamp)) {
    recordWebhook({ outcome: "signature_rejected", reason: "expired_timestamp" });
    return NextResponse.json({ error: "Webhook timestamp expired." }, { status: 401 });
  }

  const body = await request.text();
  if (!isValidSignature(secret, timestamp, body, signature)) {
    recordWebhook({ outcome: "signature_rejected", reason: "invalid_signature" });
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid webhook JSON." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const { tenantSlug, pagePath, publishedRevision } = parsed.data;
  const cacheTag = `graphood:tenant:${tenantSlug}:${pagePath}`;

  // Both operations are intentionally idempotent. Replayed valid events only
  // invalidate the same path/tag again and never mutate tenant data.
  revalidateTag(cacheTag, "max");
  recordWebhook({ outcome: "success", tenantSlug, publishedRevision });
  revalidatePath(pagePath);

  return NextResponse.json({
    ok: true,
    tenantSlug,
    pagePath,
    publishedRevision,
  });
}
