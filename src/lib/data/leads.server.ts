import { getSql } from "@/lib/db";
import { notifyInbox } from "@/lib/notify.server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: unknown): string | null {
  const email = String(raw ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 160);
  if (!EMAIL_RE.test(email)) return null;
  return email;
}

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

export function normalizeSlug(raw: unknown): string {
  const slug = String(raw ?? "all")
    .trim()
    .toLowerCase()
    .slice(0, 80);
  if (slug === "all" || slug === "pack") return slug;
  if (SLUG_RE.test(slug)) return slug;
  return "all";
}

export async function subscribeFileAlert(input: {
  email: unknown;
  projectSlug?: unknown;
  sourcePath?: unknown;
  honeypot?: unknown;
}): Promise<{ ok: true; already: boolean } | { ok: false; error: string }> {
  if (String(input.honeypot ?? "").trim()) return { ok: true, already: false };
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Enter a real email address." };
  const projectSlug = normalizeSlug(input.projectSlug);
  const sourcePath = String(input.sourcePath ?? "").slice(0, 240) || null;

  const sql = await getSql();
  const existing = await sql<{ id: number }>`
    select id from file_alerts
    where lower(email) = ${email} and project_slug = ${projectSlug} and unsubscribed_at is null
    limit 1
  `;
  if (existing[0]) return { ok: true, already: true };

  await sql.query(
    `insert into file_alerts (email, project_slug, source_path) values ($1, $2, $3)`,
    [email, projectSlug, sourcePath],
  );

  await notifyInbox(
    `File alert: ${email} · ${projectSlug}`,
    `${email} asked for file alerts (${projectSlug}).\nPath: ${sourcePath ?? "—"}\nOpen /admin to see the list.`,
  );

  return { ok: true, already: false };
}

export async function submitSiteMessage(input: {
  kind: "tip" | "resource";
  email?: unknown;
  name?: unknown;
  body?: unknown;
  sourcePath?: unknown;
  honeypot?: unknown;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (String(input.honeypot ?? "").trim()) return { ok: true };
  const body = String(input.body ?? "").trim().slice(0, 4000);
  if (body.length < 8) return { ok: false, error: "Add a sentence so we know what to check." };
  const email = input.email ? normalizeEmail(input.email) : null;
  if (input.email && String(input.email).trim() && !email) {
    return { ok: false, error: "That email does not look right." };
  }
  const name = String(input.name ?? "").trim().slice(0, 80) || null;
  const sourcePath = String(input.sourcePath ?? "").slice(0, 240) || null;

  const sql = await getSql();
  await sql.query(
    `insert into site_messages (kind, email, name, body, source_path) values ($1, $2, $3, $4, $5)`,
    [input.kind, email, name, body, sourcePath],
  );

  await notifyInbox(
    `${input.kind === "resource" ? "Local resource" : "Tip"}: ${name ?? email ?? "anonymous"}`,
    `${body}\n\nFrom: ${name ?? "—"} <${email ?? "no email"}>\nPath: ${sourcePath ?? "—"}`,
  );

  return { ok: true };
}

export async function listLeadDesk() {
  const sql = await getSql();
  try {
    const alerts = await sql<{
      id: number;
      email: string;
      project_slug: string;
      source_path: string | null;
      created_at: string;
    }>`
      select id, email, project_slug, source_path, created_at
      from file_alerts
      where unsubscribed_at is null
      order by created_at desc
      limit 80
    `;
    const messages = await sql<{
      id: number;
      kind: string;
      email: string | null;
      name: string | null;
      body: string;
      source_path: string | null;
      created_at: string;
    }>`
      select id, kind, email, name, body, source_path, created_at
      from site_messages
      order by created_at desc
      limit 40
    `;
    return {
      alerts: alerts.map((a) => ({
        id: a.id,
        email: a.email,
        projectSlug: a.project_slug,
        sourcePath: a.source_path,
        createdAt: String(a.created_at),
      })),
      messages: messages.map((m) => ({
        id: m.id,
        kind: m.kind,
        email: m.email,
        name: m.name,
        body: m.body,
        sourcePath: m.source_path,
        createdAt: String(m.created_at),
      })),
    };
  } catch (err) {
    console.error("[leads] list failed", err);
    return { alerts: [], messages: [] };
  }
}
