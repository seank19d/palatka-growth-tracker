# How the automation works

Palatka Growth Tracker is designed to keep itself current after deploy. People should only step in for a new major PUD or a broken source.

## Loop

1. **Vercel Cron** (12:00 UTC daily; Hobby plan allows one run per day) calls `GET /api/cron/update` with `Authorization: Bearer $CRON_SECRET`.
2. The job fetches every enabled row in `sources` (Google News RSS, Palatka Daily News feed, Putnam County Planning, SJRWMD Putnam page).
3. New items land in `source_items`. Titles are matched to known projects by name / case number.
4. Headlines that look like a new subdivision and mention Palatka or Putnam are flagged as candidates. The job may insert an **unpublished** draft project (`confidence = watch`) for staff review.
5. If `XAI_API_KEY` is present, Grok (`grok-4.5`) rewrites the project’s `latest_summary` and appends a What’s New entry. If the key is missing, scrapes still store; summaries stay as last written.
6. `job_runs` records success/failure. Three or more source failures can email `ALERT_EMAIL` via Resend when those vars are set.
7. Public pages always read the database. A dead scrape does not blank the site.

Staff can also press **Force source refresh** on `/admin` (signed in). That path does not need `CRON_SECRET`.

## Style guide used by the model

Service journalism: a local reporter who has read the file. Plain language, specific, dated. Distinguish public record from reports. Include dates and case numbers. No hype, no jokes, no exclamation points.

## What still needs a human

- Publishing an auto-detected draft project
- Correcting a lot count or status when a plat records
- Replacing a source URL if a county CMS moves
- Setting `AMAZON_ASSOCIATE_TAG` so product links earn

## Affiliate products

Product rows live in `affiliate_products`. Links are Amazon search or ASIN URLs with the associate tag appended on the server. No per-page curation after launch; pages pick products by `affiliate_category`.
