# Automation — no staff required

Palatka Homes Report runs itself after deploy. There is no daily editorial queue.

## Daily loop

1. **Vercel Cron** (`0 12 * * *` UTC) hits `GET /api/cron/update`.
2. **GitHub Actions** (`15 12 * * *` UTC) is a backup caller of the same endpoint.
3. The job fetches every enabled row in `sources` (Google News RSS, local news, Putnam Planning, SJRWMD).
4. New items go into `source_items` and match known projects by name / case number.
5. **Status can advance automatically** when source text clearly signals a later stage (rezoning approved → plat → construction → selling). Status never moves backward.
6. **New subdivisions** mentioned with Palatka/Putnam language are auto-published as public **watch** projects (`confidence = watch`). Readers see them; they are labeled unconfirmed.
7. If `XAI_API_KEY` is set, Grok rewrites `latest_summary` and posts a What’s New entry.
8. Three or more source failures can email `ALERT_EMAIL` via Resend when configured.
9. Public pages always read the database. A dead scrape does not blank the site.

## Auth on the cron route

Accepted when either:

- `Authorization: Bearer $CRON_SECRET`, or
- `x-vercel-cron: 1` (Vercel’s scheduled invocation header)

## Env vars for full automation

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Persistence across serverless instances (Neon) |
| `CRON_SECRET` | Auth for cron + GitHub Action |
| `XAI_API_KEY` | Plain-language summary rewrites |
| `AMAZON_ASSOCIATE_TAG` | Affiliate earnings on product links |
| `RESEND_API_KEY` + `ALERT_EMAIL` | Email only when the job is failing hard |

GitHub repo secrets: set `CRON_SECRET` to match Vercel. Optional repo variable `SITE_URL` (defaults to `https://www.palatkahomesreport.com`).

## What never needs a human

- Daily source fetch
- Matching headlines to Alford Farms and other known projects
- Advancing status on clear public signals
- Publishing new watch-list projects from news
- Writing What’s New digests when the AI key is present

## What a human might still touch (optional)

- Fixing a source URL if a county CMS moves
- Deleting a false-positive watch item
- Raising `confidence` from `watch` to `confirmed` after reading a PDF

Those are optional quality edits, not required for the site to stay current.
