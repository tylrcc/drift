import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyAccount } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials payload." }, { status: 400 });
  }
  try {
    const user = await verifyAccount(parsed.data.email, parsed.data.password);
    await createSession(user);
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Login failed" },
      { status: 401 },
    );
  }
}
