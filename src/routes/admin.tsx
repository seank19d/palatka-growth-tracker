import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { forceTrackerUpdate, loadAdmin, logAffiliateOrder, refreshAmazonCatalog, saveProjectEdits } from "@/lib/data/admin-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_STATUSES, type Project } from "@/lib/types";
import { STATUS_META } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => seo({ title: "Admin", path: "/admin", noIndex: true }),
  component: AdminPage,
});

type AdminData = Awaited<ReturnType<typeof loadAdmin>>;

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const next = await loadAdmin();
      setData(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin");
    }
  }

  useEffect(() => {
    if (user) void refresh();
  }, [user]);

  if (isPending) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Loading session…</div>;
  }
  if (!user) return <RedirectToSignIn />;

  async function runJob() {
    setBusy(true);
    try {
      const result = await forceTrackerUpdate();
      toast.message(result.ok ? "Update finished" : "Update finished with errors", {
        description: result.summary,
      });
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Console</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">Operations</h1>
        <Button type="button" onClick={() => void runJob()} disabled={busy}>
          {busy ? "Running…" : "Force source refresh"}
        </Button>
      </div>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {!data ? (
        <p className="mt-8 text-muted">Loading tracker state…</p>
      ) : (
        <div className="mt-8 space-y-10">
          <section className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">AI summaries</p>
              <p className="mt-1 font-medium">{data.aiAvailable ? "Configured" : "Not configured"}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">Amazon tag</p>
              <p className="mt-1 font-medium">{data.amazonTag || "Missing"}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">Last job</p>
              <p className="mt-1 font-medium">
                {data.jobs[0] ? `${data.jobs[0].status} · ${formatDateShort(data.jobs[0].startedAt)}` : "—"}
              </p>
            </Card>
          </section>

          <AmazonDesk data={data} onSaved={() => void refresh()} />

          <section>
            <div className="mt-4 space-y-4">
              {data.projects.map((p) => (
                <ProjectEditor key={p.id} project={p} onSaved={() => void refresh()} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Sources</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.12em] text-subtle">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Last success</th>
                    <th className="py-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sources.map((s) => (
                    <tr key={s.id} className="border-t border-border align-top">
                      <td className="py-3 pr-4">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-subtle">{s.kind}</div>
                      </td>
                      <td className="py-3 pr-4">{formatDateShort(s.lastSuccessAt)}</td>
                      <td className="py-3 text-xs text-destructive">{s.lastError ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Job runs</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {data.jobs.map((j) => (
                <li key={j.id} className="rounded-lg border border-border bg-card p-3">
                  <p className="font-medium">
                    {j.jobName} · {j.status} · {formatDateShort(j.startedAt)}
                  </p>
                  {j.summary ? <p className="mt-1 text-muted">{j.summary}</p> : null}
                  {j.error ? <p className="mt-1 text-destructive">{j.error}</p> : null}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Recent source items</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {data.items.length === 0 ? (
                <li className="text-muted">No fetches stored yet. Run a refresh.</li>
              ) : (
                data.items.map((i) => (
                  <li key={i.id} className="border-b border-border pb-3">
                    <p className="font-medium">{i.title}</p>
                    <p className="text-xs text-subtle">
                      {i.sourceName} · {i.matchedProjectName ?? (i.isNewProjectCandidate ? "candidate" : "unmatched")}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}

function dollars(cents: number | null | undefined) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function AmazonDesk({
  data,
  onSaved,
}: {
  data: AdminData;
  onSaved: () => void;
}) {
  const aff = data.affiliate;
  const [busy, setBusy] = useState(false);
  const [orderedOn, setOrderedOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [productId, setProductId] = useState("0");
  const [items, setItems] = useState("1");
  const [commission, setCommission] = useState("");
  const [note, setNote] = useState("");

  async function saveOrder() {
    setBusy(true);
    try {
      await logAffiliateOrder({
        data: {
          productId: productId ? Number(productId) : null,
          orderedOn,
          items: Number(items) || 1,
          commission,
          note,
        },
      });
      toast.success("Order logged");
      setCommission("");
      setNote("");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not log order");
    } finally {
      setBusy(false);
    }
  }

  async function refreshCatalog() {
    setBusy(true);
    try {
      const result = await refreshAmazonCatalog();
      toast.message(result.ok ? `Updated ${result.updated} products` : "Amazon API not ready", {
        description: result.error ?? "Titles, images, and prices pulled from Creators API.",
      });
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Amazon Associates</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => void refreshCatalog()} disabled={busy}>
          {data.amazonApi ? "Refresh from Amazon" : "API not connected"}
        </Button>
      </div>
      <p className="mt-2 max-w-3xl text-base text-muted">
        Tag {data.amazonTag} is on every product link. Amazon already shows at least one referred
        order. Creators API (live prices and photos) needs about ten shipped items in 30 days —
        until then, log orders from Associates Central → Reports so this desk matches the account.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Clicks · 30 days</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{aff.clicks30}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Orders logged</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{aff.orders.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Commission logged</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            {dollars(aff.commissionCents)}
          </p>
        </Card>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.12em] text-subtle">
            <tr>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">ASIN</th>
              <th className="py-2 pr-4">Clicks 30d</th>
              <th className="py-2">All clicks</th>
            </tr>
          </thead>
          <tbody>
            {aff.products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-2 pr-4 font-medium">{p.title}</td>
                <td className="py-2 pr-4 font-mono text-xs">{p.asin ?? "—"}</td>
                <td className="py-2 pr-4 tabular-nums">{p.clicks30}</td>
                <td className="py-2 tabular-nums">{p.clicksAll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="mt-6 p-4 md:p-5">
        <h3 className="font-display text-xl font-semibold">Log an Associates order</h3>
        <p className="mt-1 text-sm text-muted">
          Copy the date and commission from Amazon’s earnings report. This does not talk to Amazon
          — it keeps a local ledger until API access unlocks.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="aff-date">Order date</Label>
            <Input id="aff-date" type="date" value={orderedOn} onChange={(e) => setOrderedOn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Product (if known)</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Unassigned</SelectItem>
                {aff.products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="aff-items">Items</Label>
            <Input id="aff-items" inputMode="numeric" value={items} onChange={(e) => setItems(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aff-comm">Commission (USD)</Label>
            <Input
              id="aff-comm"
              inputMode="decimal"
              placeholder="4.25"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="aff-note">Note</Label>
          <Input
            id="aff-note"
            placeholder="First Associates order — Aug 2026"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <Button type="button" className="mt-4" size="sm" onClick={() => void saveOrder()} disabled={busy}>
          {busy ? "Saving…" : "Save order"}
        </Button>
      </Card>
      {aff.orders.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {aff.orders.map((o) => (
            <li key={o.id} className="border-b border-border pb-2">
              <span className="font-medium tabular-nums">{o.orderedOn}</span>
              {" · "}
              {o.title ?? "Unassigned"} · {o.items} item{o.items === 1 ? "" : "s"} · {dollars(o.commissionCents)}
              {o.note ? <span className="block text-muted">{o.note}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ProjectEditor({ project, onSaved }: { project: Project; onSaved: () => void }) {
  const [status, setStatus] = useState(project.status);
  const [lots, setLots] = useState(project.lotsCurrent?.toString() ?? "");
  const [published, setPublished] = useState(project.published);
  const [summary, setSummary] = useState(project.latestSummary ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await saveProjectEdits({
        data: {
          id: project.id,
          status,
          lotsCurrent: lots === "" ? null : Number(lots),
          published,
          latestSummary: summary,
          confidence: project.confidence,
        },
      });
      toast.success(`Saved ${project.name}`);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl font-semibold">{project.name}</h3>
        <p className="text-xs uppercase tracking-[0.12em] text-subtle">{project.confidence}</p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lots-${project.id}`}>Lots (best known)</Label>
          <Input
            id={`lots-${project.id}`}
            inputMode="numeric"
            value={lots}
            onChange={(e) => setLots(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Button
            type="button"
            variant={published ? "secondary" : "outline"}
            onClick={() => setPublished((v) => !v)}
          >
            {published ? "Published" : "Draft / hidden"}
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor={`sum-${project.id}`}>Latest summary</Label>
        <Textarea
          id={`sum-${project.id}`}
          rows={5}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Button type="button" size="sm" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
