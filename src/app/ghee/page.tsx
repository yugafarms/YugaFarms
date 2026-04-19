import GheePageClient from "./GheePageClient";
import { getProductsByType } from "@/lib/strapiPublic";

export default async function GheePage() {
  const products = await getProductsByType("Ghee");
  return <GheePageClient products={products} />;
}
