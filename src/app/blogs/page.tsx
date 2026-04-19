import BlogsPageClient from "./BlogsPageClient";
import { getBlogSections } from "@/lib/strapiPublic";

export default async function BlogsPage() {
  const blogs = await getBlogSections();
  return <BlogsPageClient blogs={blogs} />;
}
