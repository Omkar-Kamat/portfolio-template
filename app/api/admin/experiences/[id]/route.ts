import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { Experiences } from "@/lib/data";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const current = await Experiences.get(id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const updated = await Experiences.update(id, {
    company: body.company ?? current.company,
    role: body.role ?? current.role,
    location: body.location ?? current.location,
    startDate: body.startDate ?? current.startDate,
    endDate: body.endDate ?? current.endDate,
    description: body.description ?? current.description,
    technologies: body.technologies ?? current.technologies,
    order: body.order ?? current.order,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  await Experiences.remove(id);
  return NextResponse.json({ ok: true });
}
