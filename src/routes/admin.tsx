import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { forceTrackerUpdate, loadAdmin, saveProjectEdits } from "@/lib/data/admin-api";
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
              <p className="mt-1 font-medium">{data.amazonTag ? "Configured" : "Links untagged"}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">Last job</p>
              <p className="mt-1 font-medium">
                {data.jobs[0] ? `${data.jobs[0].status} · ${formatDateShort(data.jobs[0].startedAt)}` : "—"}
              </p>
            </Card>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Projects</h2>
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
