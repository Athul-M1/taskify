import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/auth/store";
import { SESSION_COOKIE } from "@/lib/auth/session-cookie";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) deleteSession(sessionId);
  cookieStore.delete(SESSION_COOKIE);

  return NextResponse.json({ ok: true });
}
