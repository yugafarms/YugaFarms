import HoneyPageClient from "./HoneyPageClient";
import { getProductsByType } from "@/lib/strapiPublic";

export default async function HoneyPage() {
  const products = await getProductsByType("Honey");
  return <HoneyPageClient products={products} />;
}
