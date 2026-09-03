import { createFileRoute } from "@tanstack/react-router";
import { KitQuiz } from "@/components/kit-quiz";
import { fetchStorm } from "@/lib/data/api";
import { MOVE } from "@/lib/kits";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/move")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: MOVE.seoTitle,
      description: MOVE.seoDescription,
      path: MOVE.path,
    }),
  component: MovePage,
});

function MovePage() {
  const { products } = Route.useLoaderData();
  return <KitQuiz kit={MOVE} products={products} />;
}
