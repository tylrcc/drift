import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { BillingInterval } from "@/lib/products/catalog";

const SECRET =
  process.env.LICENSE_SIGNING_SECRET ||
  process.env.STRIPE_SECRET_KEY ||
  "drift-dev-signing-secret-change-me";

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export type LicensePayload = {
  productSlug: string;
  email: string;
  interval: BillingInterval;
  exp: number | null;
  nonce: string;
};

export function generateLicenseKey(productSlug: string, email: string, interval: BillingInterval) {
  const payload: LicensePayload = {
    productSlug,
    email: email.toLowerCase(),
    interval,
    exp:
      interval === "lifetime"
        ? null
        : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    nonce: randomBytes(4).toString("hex"),
  };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", SECRET).update(body).digest());
  return `DRIFT.${body}.${sig}`;
}

export function verifyLicenseKey(licenseKey: string): LicensePayload | null {
  const parts = licenseKey.split(".");
  if (parts.length !== 3 || parts[0] !== "DRIFT") return null;
  const [, body, sig] = parts;
  const expected = b64url(createHmac("sha256", SECRET).update(body).digest());
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as LicensePayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function licenseExpiry(interval: BillingInterval) {
  if (interval === "lifetime") return null;
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

/** In-memory index for vault email lookup during a warm process. */
const memoryLicenses = new Map<
  string,
  {
    licenseKey: string;
    email: string;
    productSlug: string;
    interval: BillingInterval;
    createdAt: string;
    expiresAt: string | null;
  }
>();

export function memorySaveLicense(entry: {
  licenseKey: string;
  email: string;
  productSlug: string;
  interval: BillingInterval;
  expiresAt: string | null;
}) {
  memoryLicenses.set(entry.licenseKey, {
    ...entry,
    createdAt: new Date().toISOString(),
  });
  return entry;
}

export function memoryGetLicense(licenseKey: string) {
  const verified = verifyLicenseKey(licenseKey);
  if (verified) {
    return {
      licenseKey,
      email: verified.email,
      productSlug: verified.productSlug,
      interval: verified.interval,
      createdAt: new Date().toISOString(),
      expiresAt: verified.exp ? new Date(verified.exp * 1000).toISOString() : null,
    };
  }
  return memoryLicenses.get(licenseKey) || null;
}

export function memoryListByEmail(email: string) {
  return [...memoryLicenses.values()].filter(
    (l) => l.email.toLowerCase() === email.toLowerCase(),
  );
}
