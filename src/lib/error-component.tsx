import { useEffect } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const RELOAD_KEY = "phr-stale-chunk-reload";

function isStaleChunkError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return /failed to fetch dynamically imported module|importing a module script failed|chunkloaderror/i.test(
    msg,
  );
}

/** Call from the root after a successful render so a later deploy can reload once. */
export function clearStaleChunkReloadFlag() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(RELOAD_KEY);
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isStaleChunkError(error)) return;
    if (sessionStorage.getItem(RELOAD_KEY) === "1") return;
    sessionStorage.setItem(RELOAD_KEY, "1");
    window.location.reload();
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-destructive" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {isStaleChunkError(error)
          ? "A new version of the site just went live. Reload the page."
          : error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
      <a href="/" className="mt-2 text-sm text-primary underline-offset-4 hover:underline">
        Back to the report
      </a>
    </main>
  );
}

export function NotFoundComponent() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted">
        That URL is not a development, guide, or other page on this site.
      </p>
      <Link to="/" className="mt-6 text-primary underline-offset-4 hover:underline">
        Return home
      </Link>
    </main>
  );
}
