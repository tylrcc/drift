import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { getProduct } from "@/lib/products/catalog";
import { memoryGetLicense, verifyLicenseKey } from "@/lib/licenses";
import { createServiceClient, hasSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function assertLicense(licenseKey: string, productSlug: string) {
  const signed = verifyLicenseKey(licenseKey);
  if (signed && signed.productSlug === productSlug) return true;

  if (hasSupabase()) {
    const supabase = createServiceClient();
    if (!supabase) return false;
    const { data } = await supabase
      .from("licenses")
      .select("product_slug,status")
      .eq("license_key", licenseKey)
      .maybeSingle();
    return Boolean(
      data && data.status === "active" && data.product_slug === productSlug,
    );
  }
  const mem = memoryGetLicense(licenseKey);
  return Boolean(mem && mem.productSlug === productSlug);
}

function addDir(zip: JSZip, dir: string, zipPath: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__pycache__" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    const target = path.posix.join(zipPath, entry.name);
    if (entry.isDirectory()) addDir(zip, full, target);
    else zip.file(target, fs.readFileSync(full));
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const license = searchParams.get("license") || "";
  const productSlug = searchParams.get("product") || "";
  const product = getProduct(productSlug);
  if (!product || !license) {
    return NextResponse.json({ error: "Missing license or product" }, { status: 400 });
  }

  const ok = await assertLicense(license, productSlug);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or inactive license" }, { status: 403 });
  }

  const root = path.join(process.cwd(), "algorithms");
  const pkg = path.join(root, product.packageDir);
  if (!fs.existsSync(pkg)) {
    return NextResponse.json({ error: "Package missing on server" }, { status: 404 });
  }

  const zip = new JSZip();
  addDir(zip, pkg, product.packageDir);
  zip.file("drift_engine.py", fs.readFileSync(path.join(root, "drift_engine.py")));
  zip.file("README.md", fs.readFileSync(path.join(root, "README.md")));
  if (fs.existsSync(path.join(root, "backtest_results.json"))) {
    zip.file(
      "backtest_results.json",
      fs.readFileSync(path.join(root, "backtest_results.json")),
    );
  }
  zip.file(
    "LICENSE.txt",
    `Drift license: ${license}\nProduct: ${product.name}\nIssued for download vault access.\n`,
  );

  const buffer = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="drift-${product.slug}.zip"`,
    },
  });
}
