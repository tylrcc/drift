import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import {
  getProduct,
  priceFor,
  type BillingInterval,
} from "@/lib/products/catalog";
import {
  generateLicenseKey,
  licenseExpiry,
  memorySaveLicense,
} from "@/lib/licenses";
import { createServiceClient, hasSupabase } from "@/lib/supabase/server";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  interval: z.enum(["monthly", "lifetime"]),
  email: z.string().email(),
  acknowledgements: z.object({
    risk: z.literal(true),
    terms: z.literal(true),
    noRefunds: z.literal(true),
  }),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Checkout requires accepting risk disclosure, terms, and the no-refund policy.",
      },
      { status: 400 },
    );
  }

  const { productSlug, interval, email } = parsed.data;
  const product = getProduct(productSlug);
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  const amount = priceFor(product, interval as BillingInterval);
  const gateway = process.env.PAYMENT_GATEWAY || "mock";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (gateway === "stripe" && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: interval === "monthly" ? "subscription" : "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount,
            ...(interval === "monthly"
              ? {
                  recurring: { interval: "month" as const },
                  product_data: {
                    name: `${product.name} (monthly)`,
                    description: product.tagline,
                  },
                }
              : {
                  product_data: {
                    name: `${product.name} (lifetime)`,
                    description: product.tagline,
                  },
                }),
          },
        },
      ],
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/products/${product.slug}`,
      metadata: {
        productSlug,
        interval,
        email,
      },
    });
    return NextResponse.json({ url: session.url });
  }

  // Mock checkout: issue license immediately (no money moved).
  const licenseKey = generateLicenseKey(
    product.slug,
    email,
    interval as BillingInterval,
  );
  const expiresAt = licenseExpiry(interval as BillingInterval);

  if (hasSupabase()) {
    const supabase = createServiceClient();
    if (supabase) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          email,
          product_slug: product.slug,
          interval,
          amount_cents: amount,
          status: "paid",
          payment_provider: "mock",
          payment_ref: `mock_${Date.now()}`,
        })
        .select("id")
        .single();

      if (orderError) {
        return NextResponse.json({ error: orderError.message }, { status: 500 });
      }

      const { error: licError } = await supabase.from("licenses").insert({
        order_id: order.id,
        email,
        product_slug: product.slug,
        license_key: licenseKey,
        interval,
        status: "active",
        expires_at: expiresAt,
      });

      if (licError) {
        return NextResponse.json({ error: licError.message }, { status: 500 });
      }
    }
  } else {
    memorySaveLicense({
      licenseKey,
      email,
      productSlug: product.slug,
      interval: interval as BillingInterval,
      expiresAt,
    });
  }

  return NextResponse.json({
    licenseKey,
    productSlug: product.slug,
    provider: "mock",
  });
}
