import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { Sections } from "@/lib/data";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { order } = await req.json();
  if (!Array.isArray(order)) return NextResponse.json({ error: "order must be an array" }, { status: 400 });
  Sections.reorder(order);
  return NextResponse.json({ ok: true });
}
