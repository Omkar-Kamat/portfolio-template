import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { Experiences } from "@/lib/data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await Experiences.all());
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await req.json();
  if (!body.company || !body.role) {
    return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
  }
  const created = await Experiences.create({
    company: body.company,
    role: body.role,
    location: body.location || "",
    startDate: body.startDate || "",
    endDate: body.endDate || "Present",
    description: body.description || "",
    technologies: body.technologies || "",
    order: body.order ?? 0,
  });
  return NextResponse.json(created, { status: 201 });
}
