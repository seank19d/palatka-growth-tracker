import { createFileRoute } from "@tanstack/react-router";
import { KitQuiz } from "@/components/kit-quiz";
import { fetchStorm } from "@/lib/data/api";
import { SUMMER } from "@/lib/kits";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/summer")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: SUMMER.seoTitle,
      description: SUMMER.seoDescription,
      path: SUMMER.path,
    }),
  component: SummerPage,
});

function SummerPage() {
  const { products } = Route.useLoaderData();
  return <KitQuiz kit={SUMMER} products={products} />;
}
