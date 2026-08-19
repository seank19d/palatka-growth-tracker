import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppErrorComponent, NotFoundComponent, clearStaleChunkReloadFlag } from "@/lib/error-component";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { ORG_JSON_LD, seo } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import appCss from "../styles.css?url";

const fetchShell = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const { getSetting } = await import("@/lib/data/queries.server");
  const [u, lastUpdated] = await Promise.all([getSessionUser(), getSetting("last_public_update")]);
  return {
    lastUpdated,
    sessionUser: u ? { id: u.id, email: u.email } : null,
  };
});

export const Route = createRootRoute({
  beforeLoad: async () => fetchShell(),
  errorComponent: AppErrorComponent,
  notFoundComponent: NotFoundComponent,
  head: () => {
    const base = seo({
      title: APP_NAME,
      description: APP_DESCRIPTION,
      path: "/",
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#1e4a46" },
        ...base.meta,
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        ...base.links,
      ],
    };
  },
  component: RootDocument,
});

function RootDocument() {
  const { lastUpdated } = Route.useRouteContext();
  const plausible = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  useEffect(() => {
    clearStaleChunkReloadFlag();
  }, []);
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <JsonLd data={ORG_JSON_LD} />
        {plausible ? (
          <script defer data-domain={plausible} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main" className="flex-1">
            <Outlet />
          </div>
          <SiteFooter lastUpdated={lastUpdated} />
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
        <Scripts />
      </body>
    </html>
  );
}
