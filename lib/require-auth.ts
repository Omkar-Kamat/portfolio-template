import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}
