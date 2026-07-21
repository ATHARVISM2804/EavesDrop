import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/ProductPage";
import { getProduct } from "@/lib/content/products";

const product = getProduct("monitors")!;

export const metadata: Metadata = {
  title: product.metaTitle,
  description: product.metaDescription,
};

export default function Page() {
  return <ProductPage product={product} />;
}
