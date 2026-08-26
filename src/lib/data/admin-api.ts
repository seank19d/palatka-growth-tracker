import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/types";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const loadAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const allowed = adminEmails();
    if (allowed.length) {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<{ email: string }>`
        select email from "user" where id = ${context.userId} limit 1
      `;
      const email = rows[0]?.email?.toLowerCase() ?? "";
      if (!allowed.includes(email)) {
        throw new Error("This account is not on the admin list.");
      }
    }
    const { getAdminData } = await import("./queries.server");
    return getAdminData();
  });

export const forceTrackerUpdate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { runTrackerUpdate } = await import("@/lib/automation/run-update.server");
    return runTrackerUpdate();
  });

export const saveProjectEdits = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const d = input as {
      id: number;
      status: string;
      lotsCurrent: number | null;
      published: boolean;
      latestSummary: string;
      confidence: string;
    };
    if (!d || typeof d.id !== "number") throw new Error("Invalid project");
    if (!PROJECT_STATUSES.includes(d.status as ProjectStatus)) throw new Error("Invalid status");
    return {
      id: d.id,
      status: d.status as ProjectStatus,
      lotsCurrent: d.lotsCurrent,
      published: Boolean(d.published),
      latestSummary: String(d.latestSummary ?? ""),
      confidence: d.confidence,
    };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `update projects
       set status = $1, lots_current = $2, published = $3, latest_summary = $4,
           latest_summary_at = now(), confidence = $5, updated_at = now()
       where id = $6`,
      [data.status, data.lotsCurrent, data.published, data.latestSummary, data.confidence, data.id],
    );
    return { ok: true as const };
  });

export const logAffiliateOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const d = input as {
      productId: number | null;
      orderedOn: string;
      items: number;
      commission: string;
      note: string;
    };
    const commission = d.commission.trim() === "" ? null : Math.round(Number(d.commission) * 100);
    if (d.commission.trim() && (commission == null || Number.isNaN(commission))) {
      throw new Error("Commission must be a dollar amount");
    }
    if (!d.orderedOn) throw new Error("Order date is required");
    return {
      productId: d.productId && d.productId > 0 ? d.productId : null,
      orderedOn: d.orderedOn,
      items: Math.max(1, Number(d.items) || 1),
      commissionCents: commission,
      note: String(d.note ?? "").slice(0, 400),
    };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into affiliate_orders (product_id, ordered_on, items, commission_cents, note)
       values ($1,$2,$3,$4,$5)`,
      [data.productId, data.orderedOn, data.items, data.commissionCents, data.note || null],
    );
    return { ok: true as const };
  });

export const refreshAmazonCatalog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { refreshCatalogFromAmazon } = await import("@/lib/amazon-creators.server");
    return refreshCatalogFromAmazon();
  });
