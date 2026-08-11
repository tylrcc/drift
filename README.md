# Drift

Calm algorithmic trading storefront. Light Apple-inspired UI, original Python algorithms, instant license delivery, Vercel + Supabase ready.

## Stack

- Next.js App Router
- Supabase (optional Auth + orders + licenses)
- Stripe Checkout (optional) or mock checkout with signed license keys
- Framer Motion
- Four original research packages in `/algorithms`

## Algorithms

| Slug | Package | Style |
|------|---------|--------|
| `dawn-orb` | Opening range breakout | London + NY sessions |
| `steady` | Mean reversion | Volume-confirmed fades |
| `lift` | Trend continuation | Pullback entries |
| `apex` | Flagship multi-factor | Regime + breakout + risk |

```bash
python3 algorithms/run_backtests.py
```

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Mock checkout is on by default (`PAYMENT_GATEWAY=mock`). Buy flow issues a signed license and unlocks `/api/download`.

## Supabase (project nickname: drift)

1. Create a free Supabase project named `drift`.
2. Run `supabase/migrations/20260811000000_initial.sql` in the SQL editor.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Stripe (real money)

1. Create a free Stripe account.
2. Set `PAYMENT_GATEWAY=stripe`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
3. Point the webhook to `/api/stripe/webhook` for `checkout.session.completed`.

## Deploy

```bash
vercel --prod
```

Set the same env vars in the Vercel project. Use a free `*.vercel.app` domain (no purchase required).

## Risk

Trading involves substantial risk of loss. Research metrics are not live results.
