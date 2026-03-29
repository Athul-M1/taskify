import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/auth/constants";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email } = json as { email: string };

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = (await res.json()) as { error?: string };

  if (!res.ok) {
    return NextResponse.json(
      { error: typeof data.error === "string" ? data.error : "Failed to send reset link" },
      { status: res.status >= 400 && res.status < 600 ? res.status : 400 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
