import { randomBytes } from "crypto";

export type StoredUser = {
  email: string;
  name: string;
  passwordHash: string;
};

const users = new Map<string, StoredUser>();
const sessions = new Map<
  string,
  { email: string; expiresAt: number }
>();

const SESSION_MS = 1000 * 60 * 60 * 24 * 7;

function pruneSessions() {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (s.expiresAt <= now) sessions.delete(id);
  }
}

export function createUser(user: StoredUser): boolean {
  const key = user.email.toLowerCase();
  if (users.has(key)) return false;
  users.set(key, user);
  return true;
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase());
}

export function createSession(email: string): string {
  pruneSessions();
  const id = randomBytes(32).toString("hex");
  sessions.set(id, { email: email.toLowerCase(), expiresAt: Date.now() + SESSION_MS });
  return id;
}

export function getSessionEmail(sessionId: string): string | null {
  pruneSessions();
  const s = sessions.get(sessionId);
  if (!s || s.expiresAt <= Date.now()) {
    if (s) sessions.delete(sessionId);
    return null;
  }
  return s.email;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
