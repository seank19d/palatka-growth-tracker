# Deploy

This app is TanStack Start (Vite) on Vercel with Postgres (Neon). The live preview uses an embedded PGLite database so it runs without credentials.

GitHub repo `seank19d/palatka-growth-tracker` is linked to the Vercel project **palatka-growth**. Pushes to `main` auto-deploy.

## Platform injects

- `DATABASE_URL` — Neon Postgres. Migrations in `migrations/` apply on `npm run build`.
- Auth broker credentials for Google / X sign-in.
- `XAI_API_KEY` — optional; enables automatic summaries.

Do not commit a `.env` file.

## Set these in the host’s environment UI

| Variable | Required | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Yes, in production | Shared secret for `/api/cron/update`. Vercel Cron sends it as `Authorization: Bearer …`. |
| `AMAZON_ASSOCIATE_TAG` | For monetization | Amazon Associates tag appended to product URLs. |
| `ADMIN_EMAILS` | Recommended | Comma-separated emails allowed into `/admin`. If unset, **any signed-in user** can open the console (useful in preview). |
| `RESEND_API_KEY` | Optional | Email on repeated scrape failure. |
| `ALERT_EMAIL` | Optional | Inbox for those alerts. |
| `VITE_PLAUSIBLE_DOMAIN` | Optional | If set, loads Plausible on public pages. |

Vercel Analytics can be enabled on the project in the Vercel UI; no code change required.

## Cron

`vercel.json` registers a once-daily job (Vercel Hobby allows one run per day):

```
0 12 * * *  →  /api/cron/update
```

Until cron is live, use the admin **Force source refresh** button.

## First launch checklist

1. Deploy. Confirm `/` renders Alford Farms and the living guide.
2. Set `CRON_SECRET` and `AMAZON_ASSOCIATE_TAG`.
3. Sign in with an `ADMIN_EMAILS` account, open `/admin`, run a refresh, confirm `job_runs` shows `ok` or a logged source error (errors are expected if a county CMS blocks bots).
4. Confirm `/sitemap.xml` and `/robots.txt`.

## Local / preview

`npm run dev` binds the app for the in-browser preview. Schema + seed load automatically into PGLite. Restarting the preview resets that in-memory database and re-seeds.
