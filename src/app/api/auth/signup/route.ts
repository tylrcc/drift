import { NextResponse } from "next/server";
import { z } from "zod";
import { createAccount, createSession } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid email and password (8+ chars) required." },
      { status: 400 },
    );
  }
  try {
    const user = await createAccount(parsed.data.email, parsed.data.password);
    await createSession(user);
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Signup failed" },
      { status: 400 },
    );
  }
}
