import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getProductById, stripHtmlToPlain } from "@/lib/strapiPublic";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return { title: "Product not found | YugaFarms" };
  }
  const desc = stripHtmlToPlain(product.Description || "", 160);
  const ogImage =
    product.Image?.[0]?.url != null
      ? `${BACKEND}${product.Image[0].url}`
      : undefined;
  return {
    title: `${product.Title} | YugaFarms`,
    description: desc || product.PunchLine || undefined,
    openGraph: {
      title: product.Title,
      description: desc || product.PunchLine || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const initialProduct = await getProductById(id);
  return <ProductDetailClient initialProduct={initialProduct} />;
}
