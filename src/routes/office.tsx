import { createFileRoute } from "@tanstack/react-router";
import { KitQuiz } from "@/components/kit-quiz";
import { fetchStorm } from "@/lib/data/api";
import { OFFICE } from "@/lib/kits";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/office")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: OFFICE.seoTitle,
      description: OFFICE.seoDescription,
      path: OFFICE.path,
    }),
  component: OfficePage,
});

function OfficePage() {
  const { products } = Route.useLoaderData();
  return <KitQuiz kit={OFFICE} products={products} />;
}
