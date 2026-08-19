# Palatka Growth Tracker

Independent public tracker of planned and active housing in **Palatka**, **East Palatka**, and **Putnam County, Florida** — plus a practical living guide for people actually moving here.

**Live:** [palatka-growth.vercel.app](https://palatka-growth.vercel.app)

No renderings-as-promises. Status is based on public records (rezoning, plats, permits) and attributed news.

## What’s on the site

- **Developments** — Alford Farms, Trailway, and other pipeline communities with status, maps, and source links
- **Living guide** — climate, insurance, schools, flooding, and moving-to-Palatka notes
- **What’s new** — dated updates as county and news sources change
- **Admin** — signed-in refresh of public sources (optional)

## Stack

React 19, TanStack Start, Vite, Tailwind v4. Postgres via Neon when `DATABASE_URL` is set; otherwise an embedded PGLite database (seeded from the catalogs in `src/lib/data`).

## Deploy

This repo is linked to Vercel. Pushes to `main` auto-deploy.

Set these in the Vercel project if you want persistence, cron, and sign-in:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Recommended in production | Neon (or other Postgres). Without it, each serverless instance uses ephemeral PGLite. |
| `CRON_SECRET` | For cron | Bearer token for `GET /api/cron/update` (once daily, see `vercel.json`). |
| `AMAZON_ASSOCIATE_TAG` | For monetization | Appended to affiliate product URLs. |
| `ADMIN_EMAILS` | Recommended | Comma-separated emails allowed on `/admin`. If unset, any signed-in user can open it. |
| `XAI_API_KEY` | Optional | Grok summaries of new source items. |
| `RESEND_API_KEY` / `ALERT_EMAIL` | Optional | Email when scrapes fail repeatedly. |
| `VITE_PLAUSIBLE_DOMAIN` | Optional | Plausible analytics. |

Sign-in (Google / X) works when the host injects Better Auth + Grok auth broker credentials. Public pages do not require it.

## Local

```bash
npm install
npm run dev
```

Schema and seed load automatically into PGLite. `npm run build` must succeed before a Vercel deploy.

## Cron

`vercel.json` registers a once-daily job (Hobby plan limit):

```
0 12 * * *  →  /api/cron/update
```

Until cron is live, use **Force source refresh** on `/admin`.
