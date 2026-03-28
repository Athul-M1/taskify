import type { LoginFormData, SignupFormData } from "./schemas";

async function parseJson(res: Response): Promise<{ error?: string } & Record<string, unknown>> {
  try {
    return (await res.json()) as { error?: string } & Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function loginRequest(data: LoginFormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const body = await parseJson(res);
  if (!res.ok) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "Sign in failed" };
  }
  return { ok: true };
}

export async function registerRequest(
  data: SignupFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const body = await parseJson(res);
  if (!res.ok) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "Could not create account" };
  }
  return { ok: true };
}
