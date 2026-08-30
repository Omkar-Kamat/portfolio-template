import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { Sections } from "@/lib/data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await Sections.all());
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await req.json();
  const { id, enabled, title, content } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const current = (await Sections.all()).find((s) => s.id === id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = await Sections.update(id, {
    enabled: enabled !== undefined ? (enabled ? 1 : 0) : current.enabled,
    title: title !== undefined ? title : current.title,
    content: content !== undefined ? JSON.stringify(content) : current.content,
    order: current.order,
  });
  return NextResponse.json(updated);
}
