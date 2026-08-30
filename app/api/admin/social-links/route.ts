import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { SocialLinks } from "@/lib/data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json(SocialLinks.all());
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await req.json();
  if (!body.platform || !body.url) {
    return NextResponse.json({ error: "Platform and URL are required" }, { status: 400 });
  }
  const id = SocialLinks.create({ platform: body.platform, url: body.url, order: body.order ?? 0 });
  return NextResponse.json({ id }, { status: 201 });
}
