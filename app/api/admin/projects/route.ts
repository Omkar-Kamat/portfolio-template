import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { Projects } from "@/lib/data";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await Projects.all());
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await req.json();

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);

  const created = await Projects.create({
    title: body.title,
    slug,
    description: body.description || "",
    shortDesc: body.shortDesc || "",
    image: body.image || "",
    githubUrl: body.githubUrl || "",
    liveUrl: body.liveUrl || "",
    technologies: body.technologies || "",
    featured: body.featured ? 1 : 0,
    published: body.published === false ? 0 : 1,
    order: body.order ?? 0,
  });

  return NextResponse.json(created, { status: 201 });
}
