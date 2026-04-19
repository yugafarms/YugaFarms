import type { Metadata } from "next";
import BlogsPageClient from "./BlogsPageClient";
import { getBlogSections } from "@/lib/strapiPublic";

export const metadata: Metadata = {
  title: "Blog — Ghee, Honey & Wellness Tips",
  description:
    "Read YugaFarms blogs on A2 ghee, bilona method, raw honey & healthy living. Recipes, stories & tips from our farm to your kitchen.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blog — Ghee, Honey & Wellness | YugaFarms",
    description:
      "Stories and tips about pure ghee, natural honey, and traditional food from YugaFarms.",
  },
};

export default async function BlogsPage() {
  const blogs = await getBlogSections();
  return <BlogsPageClient blogs={blogs} />;
}
