import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FileAlertForm({
  projectSlug = "all",
  sourcePath,
  compact = false,
  heading,
  lede,
  className,
}: {
  projectSlug?: string;
  sourcePath?: string;
  compact?: boolean;
  heading?: string;
  lede?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "dup" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    setError(null);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          projectSlug,
          sourcePath: sourcePath ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
          website: honeypot,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; already?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("err");
        setError(data.error ?? "Could not save that address.");
        return;
      }
      setStatus(data.already ? "dup" : "ok");
    } catch {
      setStatus("err");
      setError("Network hiccup. Try once more.");
    }
  }

  const title =
    heading ??
    (projectSlug === "all" ? "Email me when a file changes" : "Email me when this file changes");
  const copy =
    lede ??
    (projectSlug === "alford-farms"
      ? "Alford Farms will sit in permitting until a plat records. We will write when that happens — not when a rendering drops."
      : "Status changes, plats, and sales openings. No weekly newsletter unless something in the file actually moved.");

  if (status === "ok" || status === "dup") {
    return (
      <div className={cn("border border-primary/20 bg-accent/40 p-5 md:p-6", className)}>
        <p className="font-display text-xl font-semibold">
          {status === "dup" ? "Already on this list." : "You’re on the list."}
        </p>
        <p className="mt-2 text-base leading-relaxed text-muted">
          We send mail when the public file changes — plat recorded, sales opening, or a case number
          landing. Not a weekly digest.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={cn(
        compact ? "border border-border bg-card p-4 md:p-5" : "border border-border bg-card p-5 md:p-6",
        className,
      )}
    >
      <p className="font-display text-xl font-semibold md:text-2xl">{title}</p>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{copy}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Label htmlFor={`alert-email-${projectSlug}`}>Email</Label>
          <Input
            id={`alert-email-${projectSlug}`}
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={status === "busy"} className="sm:mb-0">
          {status === "busy" ? "Saving…" : "Get the file alert"}
        </Button>
      </div>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden
      />
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      <p className="mt-3 text-xs leading-relaxed text-subtle">
        Independent report. Not a brokerage. Unsubscribe by writing back when we email you.
      </p>
    </form>
  );
}
