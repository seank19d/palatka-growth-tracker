import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => seo({ title: "Staff sign in", path: "/login", noIndex: true }),
  component: Login,
});

function Login() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Staff</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Sign in to the console</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Public pages do not require an account. Sign-in is for people who maintain the report —
        forcing a source refresh or correcting a status.
      </p>
      <div className="mt-8 space-y-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn(p.providerId, { callbackURL: "/admin" })}
            >
              Continue with {p.label}
            </Button>
          ))
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled in this environment.</p>
        )}
      </div>
    </main>
  );
}
