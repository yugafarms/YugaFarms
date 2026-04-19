import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Bilona Ghee & Farm Story",
  description:
    "Learn how YugaFarms makes pure A2 bilona ghee and raw honey — small batches, Indian farms, and traditions passed down generations. Our story.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
