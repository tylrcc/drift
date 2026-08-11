# Drift Financial

Calm algorithmic trading storefront. Live at [https://driftfinancial.vercel.app](https://driftfinancial.vercel.app).

Light Apple-inspired UI, original Python algorithms, interactive research equity chart, account auth, instant license delivery.

## Stack

- Next.js App Router
- Signed license keys + vault downloads
- Account signup/signin (session cookies)
- Stripe Checkout (optional) or mock checkout
- Framer Motion + scrubbable blue equity curve

## Algorithms

| Slug | Monthly | Lifetime |
|------|---------|----------|
| `steady` | $247 | $1,197 |
| `dawn-orb` | $397 | $1,797 |
| `lift` | $697 | $2,997 |
| `apex` | $997 | $4,497 |

## Legal

All sales are final after license delivery. See `/legal/terms`, `/legal/risk`, `/legal/refunds`, `/legal/compliance`, and `/legal/eula`.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Deploy

```bash
vercel --prod
```

Production URL: `https://driftfinancial.vercel.app`  
GitHub: `https://github.com/tylrcc/drift`
