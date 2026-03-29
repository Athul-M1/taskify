import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signupSchema } from "@/lib/auth/schemas";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/auth/constants";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = (await res.json()) as { error?: string; token?: string; email?: string; user?: { name?: string } };

  if (!res.ok) {
    return NextResponse.json(
      { error: typeof data.error === "string" ? data.error : "Could not create account" },
      { status: res.status >= 400 && res.status < 600 ? res.status : 400 }
    );
  }

  // Registration no longer returns a token immediately since verification is required
  return NextResponse.json(
    { ok: true, name: data.user?.name ?? name, email: data.email ?? email },
    { status: 201 }
  );
}
