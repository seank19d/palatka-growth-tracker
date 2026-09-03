import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TipForm({
  kind,
  heading,
  lede,
}: {
  kind: "tip" | "resource";
  heading: string;
  lede: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    setError(null);
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          email,
          body,
          website: honeypot,
          sourcePath: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("err");
        setError(data.error ?? "Could not send that.");
        return;
      }
      setStatus("ok");
    } catch {
      setStatus("err");
      setError("Network hiccup. Try once more.");
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-primary/20 bg-accent/40 p-5">
        <p className="font-display text-xl font-semibold">Got it.</p>
        <p className="mt-2 text-base text-muted">
          If it belongs in a county file, we will check the file. If it is a rumor, it stays a rumor.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="border border-border bg-card p-5 md:p-6">
      <p className="font-display text-xl font-semibold">{heading}</p>
      <p className="mt-2 text-base leading-relaxed text-muted">{lede}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${kind}-name`}>Name (optional)</Label>
          <Input id={`${kind}-name`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${kind}-email`}>Email (optional)</Label>
          <Input
            id={`${kind}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <Label htmlFor={`${kind}-body`}>
          {kind === "resource" ? "What do you offer locally?" : "What should we check?"}
        </Label>
        <Textarea
          id={`${kind}-body`}
          required
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
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
      <Button type="submit" className="mt-4" disabled={status === "busy"}>
        {status === "busy" ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
