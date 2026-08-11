import { NextResponse } from "next/server";
import { z } from "zod";
import { memoryGetLicense, memoryListByEmail, verifyLicenseKey } from "@/lib/licenses";
import { createServiceClient, hasSupabase } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  license: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lookup" }, { status: 400 });
  }
  const email = parsed.data.email || "";
  const license = parsed.data.license || "";

  if (hasSupabase()) {
    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase unavailable" }, { status: 500 });
    }
    let query = supabase
      .from("licenses")
      .select("license_key,product_slug,interval,created_at,status")
      .eq("status", "active");
    if (license) query = query.eq("license_key", license);
    else if (email) query = query.eq("email", email);
    else return NextResponse.json({ error: "Email or license required" }, { status: 400 });

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      licenses: (data || []).map((r) => ({
        licenseKey: r.license_key,
        productSlug: r.product_slug,
        interval: r.interval,
        createdAt: r.created_at,
      })),
    });
  }

  if (license) {
    const signed = verifyLicenseKey(license);
    const row = signed
      ? {
          licenseKey: license,
          productSlug: signed.productSlug,
          interval: signed.interval,
          createdAt: new Date().toISOString(),
        }
      : memoryGetLicense(license);
    return NextResponse.json({
      licenses: row
        ? [
            {
              licenseKey: "licenseKey" in row ? row.licenseKey : license,
              productSlug: row.productSlug,
              interval: row.interval,
              createdAt: "createdAt" in row ? row.createdAt : new Date().toISOString(),
            },
          ]
        : [],
    });
  }

  if (!email) {
    return NextResponse.json({ error: "Email or license required" }, { status: 400 });
  }

  return NextResponse.json({
    licenses: memoryListByEmail(email).map((r) => ({
      licenseKey: r.licenseKey,
      productSlug: r.productSlug,
      interval: r.interval,
      createdAt: r.createdAt,
    })),
  });
}
