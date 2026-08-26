# Automation — no staff required

Palatka Homes Report runs itself after deploy. There is no daily editorial queue.

## Daily loop

1. **Vercel Cron** (`0 12 * * *` UTC, 8:00 a.m. Eastern) hits `GET /api/cron/update`.
2. **GitHub Actions** (`15 12 * * *` UTC) is a backup caller of the same endpoint (needs repo secret `CRON_SECRET`).
3. If a check is more than 18 hours late, a public page load kicks the same job so a missed cron does not stall the file.
4. The job fetches every enabled row in `sources` (Google News RSS, Palatka Daily News, Putnam Planning, City of Palatka Planning).
5. Housing-related items go into `source_items` and match known projects by name / case number.
6. **Status can advance automatically** when source text clearly signals a later stage (rezoning approved → plat → construction → selling). Status never moves backward.
7. **New subdivisions** mentioned with Palatka/Putnam language are auto-published as public **watch** projects (`confidence = watch`). Readers see them; they are labeled unconfirmed.
8. New housing mentions become a What’s New note. If `XAI_API_KEY` is set, the note is rewritten in plain language; otherwise a sourced headline digest is posted so the public page still moves.
9. Three or more source failures can email `ALERT_EMAIL` via Resend when configured.
10. Public pages always read the database. A dead scrape does not blank the site.

## Auth on the cron route

Accepted when either:

- `Authorization: Bearer $CRON_SECRET`, or
- `x-vercel-cron: 1` (Vercel’s scheduled invocation header)

## Env vars for full automation

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Persistence across serverless instances (Neon) |
| `CRON_SECRET` | Auth for GitHub Action backup (Vercel Cron sends its own header) |
| `XAI_API_KEY` | Plain-language summary rewrites |
| `AMAZON_ASSOCIATE_TAG` | Affiliate earnings on product links |
| `RESEND_API_KEY` + `ALERT_EMAIL` | Email only when the job is failing hard |

GitHub repo secrets: set `CRON_SECRET` to match Vercel if you want the Actions backup. Optional repo variable `SITE_URL` (defaults to `https://www.palatkahomesreport.com`).

## What never needs a human

- Daily source fetch
- Matching headlines to Alford Farms and other known projects
- Advancing status on clear public signals
- Publishing new watch-list projects from news
- Writing What’s New when sources mention Palatka-area housing

## What a human might still touch (optional)

- Fixing a source URL if a county CMS moves
- Deleting a false-positive watch item
- Raising `confidence` from `watch` to `confirmed` after reading a PDF

Those are optional quality edits, not required for the site to stay current.
