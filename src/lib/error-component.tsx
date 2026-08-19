import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-destructive" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
      <Link to="/" className="mt-2 text-sm text-primary underline-offset-4 hover:underline">
        Back to the tracker
      </Link>
    </main>
  );
}

export function NotFoundComponent() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">404</p>
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
