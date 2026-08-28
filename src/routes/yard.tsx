import { createFileRoute } from "@tanstack/react-router";
import { KitQuiz } from "@/components/kit-quiz";
import { fetchStorm } from "@/lib/data/api";
import { YARD } from "@/lib/kits";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/yard")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: YARD.seoTitle,
      description: YARD.seoDescription,
      path: YARD.path,
    }),
  component: YardPage,
});

function YardPage() {
  const { products } = Route.useLoaderData();
  return <KitQuiz kit={YARD} products={products} />;
}
