import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/auth/schemas";
import { hashPassword } from "@/lib/auth/password";
import { createUser, getUserByEmail } from "@/lib/auth/store";
import { setSessionForEmail } from "@/lib/auth/session-cookie";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const ok = createUser({
    email: email.toLowerCase(),
    name,
    passwordHash: hashPassword(password),
  });

  if (!ok) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  await setSessionForEmail(email.toLowerCase());

  return NextResponse.json({ ok: true, name }, { status: 201 });
}
