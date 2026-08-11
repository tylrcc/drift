import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  generateLicenseKey,
  licenseExpiry,
  memorySaveLicense,
} from "@/lib/licenses";
import type { BillingInterval } from "@/lib/products/catalog";
import { createServiceClient, hasSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 501 });
  }

  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.metadata?.email;
    const productSlug = session.metadata?.productSlug;
    const interval = (session.metadata?.interval || "lifetime") as BillingInterval;
    if (!email || !productSlug) {
      return NextResponse.json({ received: true, skipped: true });
    }

    const licenseKey = generateLicenseKey(productSlug, email, interval);
    const expiresAt = licenseExpiry(interval);
    const amount = session.amount_total || 0;

    if (hasSupabase()) {
      const supabase = createServiceClient();
      if (supabase) {
        const { data: order } = await supabase
          .from("orders")
          .insert({
            email,
            product_slug: productSlug,
            interval,
            amount_cents: amount,
            status: "paid",
            payment_provider: "stripe",
            payment_ref: session.id,
          })
          .select("id")
          .single();

        if (order) {
          await supabase.from("licenses").insert({
            order_id: order.id,
            email,
            product_slug: productSlug,
            license_key: licenseKey,
            interval,
            status: "active",
            expires_at: expiresAt,
          });
        }
      }
    } else {
      memorySaveLicense({
        licenseKey,
        email,
        productSlug,
        interval,
        expiresAt,
      });
    }
  }

  return NextResponse.json({ received: true });
}
