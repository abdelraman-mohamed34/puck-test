import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function safePath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function validToken(token: string | null): boolean {
  const expected = process.env.GRAPHOOD_PREVIEW_TOKEN;
  return Boolean(expected && token && token.length === expected.length && token === expected);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const preview = searchParams.get("preview") === "true";
  const token = searchParams.get("token");

  if (!preview || !validToken(token)) {
    return NextResponse.json({ error: "Invalid Graphood preview request." }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  return NextResponse.redirect(new URL(safePath(searchParams.get("path")), request.url));
}
