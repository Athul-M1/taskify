/** HttpOnly cookie storing the JWT from the Go API (set by Next.js auth routes). */
export const AUTH_COOKIE = "auth_token";

export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL ?? process.env.API_URL ?? "http://localhost:8080";
  return url.replace(/\/$/, "");
}
