import type { Metadata } from "next";
import ClientBlogPage from "./ClientBlogPage";
import { getBlogBySlug, stripHtmlToPlain } from "@/lib/strapiPublic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return { title: "Blog | YugaFarms" };
  }
  return {
    title: `${blog.Title} | YugaFarms`,
    description: stripHtmlToPlain(blog.Content, 160),
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return <ClientBlogPage blog={blog} />;
}
