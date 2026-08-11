import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

type StoredUser = AuthUser & { passwordHash: string; salt: string };

const COOKIE = "drift_session";
const TMP_PATH = path.join("/tmp", "drift-accounts.json");

function secretKey() {
  const raw =
    process.env.LICENSE_SIGNING_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "drift-dev-signing-secret-change-me";
  return new TextEncoder().encode(raw);
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function loadLocalUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(TMP_PATH)) return [];
    return JSON.parse(fs.readFileSync(TMP_PATH, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredUser[]) {
  fs.writeFileSync(TMP_PATH, JSON.stringify(users, null, 2));
}

export async function createAccount(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || password.length < 8) {
    throw new Error("Use a valid email and a password of at least 8 characters.");
  }

  const users = loadLocalUsers();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("An account with that email already exists.");
  }
  const salt = randomBytes(16).toString("hex");
  const user: StoredUser = {
    id: createHash("sha256").update(normalized + salt).digest("hex").slice(0, 24),
    email: normalized,
    passwordHash: hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveLocalUsers(users);
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function verifyAccount(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const users = loadLocalUsers();
  const user = users.find((u) => u.email === normalized);
  if (!user) throw new Error("Invalid email or password.");
  const next = hashPassword(password, user.salt);
  const a = Buffer.from(next, "hex");
  const b = Buffer.from(user.passwordHash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Invalid email or password.");
  }
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function createSession(user: AuthUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      id: payload.sub,
      email: payload.email,
      createdAt: "",
    };
  } catch {
    return null;
  }
}
