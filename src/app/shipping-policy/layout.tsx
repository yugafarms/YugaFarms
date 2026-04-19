import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping and delivery information for YugaFarms orders — timelines, coverage across India, and how we send your ghee and honey safely.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
