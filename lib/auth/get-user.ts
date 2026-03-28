import { cookies } from "next/headers";
import { getSessionEmail, getUserByEmail } from "@/lib/auth/store";
import { SESSION_COOKIE } from "@/lib/auth/session-cookie";

export async function getSessionUser(): Promise<{ email: string; name: string } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const email = getSessionEmail(sessionId);
  if (!email) return null;
  const user = getUserByEmail(email);
  if (!user) return null;
  return { email: user.email, name: user.name };
}
