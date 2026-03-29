import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/auth/constants";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, otp } = json as { email: string; otp: string };

  if (!email || !otp) {
    return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
  }

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = (await res.json()) as { error?: string; token?: string };

  if (!res.ok) {
    return NextResponse.json(
      { error: typeof data.error === "string" ? data.error : "Verification failed" },
      { status: res.status >= 400 && res.status < 600 ? res.status : 400 }
    );
  }

  if (!data.token) {
    return NextResponse.json({ error: "Token not received from server" }, { status: 502 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
