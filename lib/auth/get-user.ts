import { cookies } from "next/headers";
import { AUTH_COOKIE, getBackendUrl } from "@/lib/auth/constants";

export async function getSessionUser(): Promise<{ id: string; email: string; name: string; role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const user = (await res.json()) as { id?: string; email?: string; name?: string; role?: string };
  if (!user.email || !user.name || !user.role || !user.id) return null;

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
