import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/auth/constants";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, token, password } = json as { email: string; token: string; password: string };

  if (!email || !token || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token, password }),
  });

  const data = (await res.json()) as { error?: string };

  if (!res.ok) {
    return NextResponse.json(
      { error: typeof data.error === "string" ? data.error : "Failed to reset password" },
      { status: res.status >= 400 && res.status < 600 ? res.status : 400 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
