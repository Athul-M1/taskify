import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/auth/constants";

export async function proxyRequest(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  
  const backend = getBackendUrl();
  const url = `${backend}${path}`;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return NextResponse.json(
          { error: data.error || "Request failed" },
          { status: res.status }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy Error [${path}]:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
