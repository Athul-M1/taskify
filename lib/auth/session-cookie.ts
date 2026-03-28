import { cookies } from "next/headers";
import { createSession } from "@/lib/auth/store";

export const SESSION_COOKIE = "session";

export async function setSessionForEmail(email: string): Promise<void> {
  const sessionId = createSession(email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
