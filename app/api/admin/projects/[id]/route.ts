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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const project = Projects.get(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const current = Projects.get(id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const slug = body.slug !== undefined ? slugify(body.slug || body.title || current.title) : current.slug;

  const updated = Projects.update(id, {
    title: body.title ?? current.title,
    slug,
    description: body.description ?? current.description,
    shortDesc: body.shortDesc ?? current.shortDesc,
    image: body.image ?? current.image,
    githubUrl: body.githubUrl ?? current.githubUrl,
    liveUrl: body.liveUrl ?? current.liveUrl,
    technologies: body.technologies ?? current.technologies,
    featured: body.featured !== undefined ? (body.featured ? 1 : 0) : current.featured,
    published: body.published !== undefined ? (body.published ? 1 : 0) : current.published,
    order: body.order ?? current.order,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  Projects.remove(id);
  return NextResponse.json({ ok: true });
}
