import { ProductBlock } from "@/components/guide/product-block";
import type { AffiliateProduct } from "@/lib/types";
export type PackCtaCopy = { heading: string; note: string };
export function PackCta({ heading, note, products }: PackCtaCopy & { products: AffiliateProduct[] }) {
  return <ProductBlock products={products} heading={heading} note={note} />;
}
