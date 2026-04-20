import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { buildBlogPostingJsonLd, truncateMetaDescription } from "@/lib/seo";
import { getBlogBySlug, stripHtmlToPlain } from "@/lib/strapiPublic";
import BlogArticle from "./BlogArticle";
import BlogNotFound from "./BlogNotFound";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return {
      title: "Blog post",
      description: "Read ghee and honey stories on the YugaFarms blog.",
    };
  }
  const description = truncateMetaDescription(
    stripHtmlToPlain(blog.Content, 500),
    160
  );
  return {
    title: blog.Title,
    description,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: `${blog.Title} | YugaFarms`,
      description,
    },
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  return (
    <>
      {blog ? <JsonLd data={buildBlogPostingJsonLd(blog)} /> : null}
      <TopBar />
      {blog ? <BlogArticle blog={blog} /> : <BlogNotFound />}
      <Footer />
    </>
  );
}
