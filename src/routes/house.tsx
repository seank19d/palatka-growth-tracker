import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { ProductBlock } from "@/components/guide/product-block";
import { fetchStorm } from "@/lib/data/api";
import { HOUSE_CARDS } from "@/lib/kits";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/house")({
  loader: () => fetchStorm(),
  head: () => seo({
    title: "Shop moving & home essentials for Palatka",
    description: "Browse moving supplies, home setup, tools and outdoor essentials. Compare options on Amazon, or use a short guide to narrow your list. Affiliate links.",
    path: "/house",
  }),
  component: HousePage,
});
const CATEGORY_LABELS: Record<string, string> = {
  moving: "Moving supplies", "home-setup": "Home setup", tools: "Tools & repairs",
  outdoor: "Outdoor living", storm: "Storm supplies", safety: "Safety",
};
function HousePage() {
  const { products } = Route.useLoaderData();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const filtered = useMemo(() => products.filter(p =>
    (category === "all" || p.category === category) &&
    `${p.title} ${p.blurb} ${CATEGORY_LABELS[p.category] ?? p.category}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [products, category, query]);
  return (
    <main className="phr-shop">
      <JsonLd data={breadcrumbJsonLd([{name: "Home", path: "/"}, {name: "Shop essentials", path: "/house"}])} />
      <section className="phr-shop-hero">
        <div className="phr-container">
          <span className="phr-eyebrow">THE EVERYDAY ESSENTIALS</span>
          <h1>Make yourself<br /><em>at home.</em></h1>
          <p>Moving boxes. First-night basics. The tools you’ll reach for again. Find what you need for your next chapter in Palatka.</p>
          <div className="phr-shop-actions">
            <a href="#shop-products" className="phr-button phr-lime">Browse essentials <ArrowRight size={18} aria-hidden /></a>
            <a href="#shopping-guides" className="phr-text-link phr-light-link">Help me choose</a>
          </div>
          <p className="phr-shop-how">Browse here → Compare options on Amazon → Buy there</p>
        </div>
      </section>
      <section className="phr-container phr-shop-catalog" id="shop-products" aria-labelledby="shop-title">
        <div className="phr-shop-catalog-heading">
          <div><span className="phr-eyebrow">YOUR LIST STARTS HERE</span><h2 id="shop-title">What do you need?</h2></div>
          <label className="phr-shop-search"><Search size={20} aria-hidden /><input type="search" aria-label="Search essentials" placeholder="Try boxes, lights, or tools" value={query} onChange={e => setQuery(e.target.value)} /></label>
        </div>
        <div className="phr-shop-filters" role="group" aria-label="Filter essentials by category">
          {["all", ...categories].map(key => <button key={key} type="button" aria-pressed={category === key} onClick={() => setCategory(key)}>{key === "all" ? "All essentials" : CATEGORY_LABELS[key] ?? key.replaceAll("-", " ")}</button>)}
        </div>
        <p role="status" className="phr-shop-count">{filtered.length} {filtered.length === 1 ? "item" : "items"}{category !== "all" || query.trim() ? " match your selection" : " to explore"}</p>
        {filtered.length ? <ProductBlock products={filtered} heading={category === "all" ? "Essentials for your next chapter" : CATEGORY_LABELS[category] ?? category} grid /> : <div className="phr-shop-empty"><h3>No matching essentials.</h3><p>Try a different search, or browse the full list.</p><button type="button" className="phr-button phr-dark" onClick={() => {setCategory("all"); setQuery("");}}>Show all essentials</button></div>}
      </section>
      <section className="phr-container phr-shop-guides" id="shopping-guides" aria-labelledby="guides-title">
        <span className="phr-eyebrow">A LITTLE HELP CHOOSING</span><h2 id="guides-title">Shop for the moment you’re in.</h2>
        <p>Prefer a shorter list? Pick a guide. Each one includes essentials you can shop right away, plus optional questions to tailor the list.</p>
        <ul>{HOUSE_CARDS.map(c => <li key={c.to}><Link to={c.to}><span className="phr-eyebrow">{c.kicker}</span><h3>{c.title}</h3><p>{c.blurb}</p><span className="phr-text-link">Explore this list <ArrowRight size={18} aria-hidden /></span></Link></li>)}</ul>
      </section>
    </main>
  );
}
