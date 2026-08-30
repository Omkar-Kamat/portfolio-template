import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { SettingsStore } from "@/lib/data";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await SettingsStore.get());
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await req.json();
  const current = await SettingsStore.get();
  const updated = await SettingsStore.update({
    siteName: body.siteName ?? current.siteName,
    tagline: body.tagline ?? current.tagline,
    heroName: body.heroName ?? current.heroName,
    heroRole: body.heroRole ?? current.heroRole,
    heroText: body.heroText ?? current.heroText,
    aboutText: body.aboutText ?? current.aboutText,
    contactEmail: body.contactEmail ?? current.contactEmail,
    resumeUrl: body.resumeUrl ?? current.resumeUrl,
    published: body.published !== undefined ? (body.published ? 1 : 0) : current.published,
  });
  return NextResponse.json(updated);
}
