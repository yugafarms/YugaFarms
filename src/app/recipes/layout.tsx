import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes — Cook with Pure Ghee & Honey",
  description:
    "Recipe ideas using A2 bilona ghee and natural honey — healthy Indian cooking, desserts, and everyday meals with YugaFarms ingredients.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
