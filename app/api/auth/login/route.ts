import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/auth/schemas";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/auth/constants";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = (await res.json()) as { error?: string; token?: string; user?: { name?: string } };

  if (!res.ok) {
    return NextResponse.json(
      { error: typeof data.error === "string" ? data.error : "Sign in failed" },
      { status: res.status }
    );
  }

  if (!data.token) {
    return NextResponse.json({ error: "Invalid response from server" }, { status: 502 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    ok: true,
    name: data.user?.name,
  });
}
