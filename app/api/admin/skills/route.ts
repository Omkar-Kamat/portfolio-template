import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { Skills } from "@/lib/data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await Skills.all());
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const id = await Skills.create({
    name: body.name,
    category: body.category || "Tools",
    order: body.order ?? 0,
  });
  return NextResponse.json({ id }, { status: 201 });
}
