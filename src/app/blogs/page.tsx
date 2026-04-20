import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { buildBlogIndexItemListJsonLd } from "@/lib/seo";
import { getBlogSections } from "@/lib/strapiPublic";
import BlogsListing from "./BlogsListing";

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

export const revalidate = 300;

export default async function BlogsPage() {
  const blogs = await getBlogSections();

  return (
    <>
      {blogs.length > 0 ? <JsonLd data={buildBlogIndexItemListJsonLd(blogs)} /> : null}
      <TopBar />
      <BlogsListing blogs={blogs} />
      <Footer />
    </>
  );
}
