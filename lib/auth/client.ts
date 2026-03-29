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
): Promise<{ ok: true; email?: string } | { ok: false; error: string }> {
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
  return { ok: true, email: body.email as string };
}

export async function verifyOtpRequest(
  email: string,
  otp: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
    credentials: "include",
  });
  const body = await parseJson(res);
  if (!res.ok) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "Verification failed" };
  }
  return { ok: true };
}

export async function resendOtpRequest(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/resend-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  const body = await parseJson(res);
  if (!res.ok) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "Could not resend OTP" };
  }
  return { ok: true };
}

export async function forgotPasswordRequest(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "Failed to process request" };
  }
  return { ok: true };
}

export async function resetPasswordRequest(
  email: string,
  token: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token, password }),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "Failed to reset password" };
  }
  return { ok: true };
}
