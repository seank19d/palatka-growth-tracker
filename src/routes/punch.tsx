import { createFileRoute } from "@tanstack/react-router";
import { KitQuiz } from "@/components/kit-quiz";
import { fetchStorm } from "@/lib/data/api";
import { PUNCH } from "@/lib/kits";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/punch")({
  loader: () => fetchStorm(),
  head: () =>
    seo({
      title: PUNCH.seoTitle,
      description: PUNCH.seoDescription,
      path: PUNCH.path,
    }),
  component: PunchPage,
});

function PunchPage() {
  const { products } = Route.useLoaderData();
  return <KitQuiz kit={PUNCH} products={products} />;
}
