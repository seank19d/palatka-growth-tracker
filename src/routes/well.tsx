import { createFileRoute } from "@tanstack/react-router";
import { KitQuiz } from "@/components/kit-quiz";
import { fetchStorm } from "@/lib/data/api";
import { WELL } from "@/lib/kits";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/well")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: WELL.seoTitle,
      description: WELL.seoDescription,
      path: WELL.path,
    }),
  component: WellPage,
});

function WellPage() {
  const { products } = Route.useLoaderData();
  return <KitQuiz kit={WELL} products={products} />;
}
