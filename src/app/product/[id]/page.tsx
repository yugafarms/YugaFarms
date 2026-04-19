import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  productMetaDescription,
} from "@/lib/seo";
import { getProductById } from "@/lib/strapiPublic";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return { title: "Product not found", description: "This product could not be found." };
  }
  const description = productMetaDescription(product);
  const ogImage =
    product.Image?.[0]?.url != null
      ? `${BACKEND}${product.Image[0].url}`
      : undefined;
  return {
    title: product.Title,
    description,
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title: `${product.Title} | YugaFarms`,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const initialProduct = await getProductById(id);

  const breadcrumbLd =
    initialProduct != null
      ? buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          {
            name: initialProduct.Type,
            path: `/${initialProduct.Type.toLowerCase()}`,
          },
          { name: initialProduct.Title, path: `/product/${id}` },
        ])
      : null;

  const productLd =
    initialProduct != null ? buildProductJsonLd(initialProduct, BACKEND) : null;

  return (
    <>
      {breadcrumbLd ? <JsonLd data={breadcrumbLd} /> : null}
      {productLd ? <JsonLd data={productLd} /> : null}
      <ProductDetailClient initialProduct={initialProduct} />
    </>
  );
}
