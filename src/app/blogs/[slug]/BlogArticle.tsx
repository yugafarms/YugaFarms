import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { BlogSection } from "@/lib/strapiPublic";
import { getBackendUrl } from "@/lib/strapiPublic";

export default function BlogArticle({ blog }: { blog: BlogSection }) {
  const backend = getBackendUrl();
  const coverSrc = blog.CoverImage?.url
    ? blog.CoverImage.url.startsWith("http")
      ? blog.CoverImage.url
      : `${backend}${blog.CoverImage.url}`
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] pb-12 md:pb-16 relative">
      <div className="container mx-auto px-4 max-w-6xl pt-4 md:pt-6">
        <Link
          href="/blogs"
          className="inline-flex items-center text-[#4b2e19]/70 hover:text-[#2f4f2f] mb-8 font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Back to all blogs
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#4b2e19]/5">
          {coverSrc ? (
            <div className="relative w-full h-[30vh] md:h-[50vh] bg-gray-100">
              <Image
                src={coverSrc}
                alt={blog.CoverImage?.alternativeText || blog.Title}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <div className="p-8 md:p-14">
            <header className="mb-10 text-center">
              <p className="text-[#f5d26a] font-bold tracking-wider uppercase text-sm mb-4">
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#4b2e19] leading-tight mb-6 font-[Pacifico]">
                {blog.Title}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] mx-auto rounded-full" />
            </header>

            <div className="prose-blog">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-[#4b2e19]" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#4b2e19]" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-xl font-bold mt-6 mb-3 text-[#4b2e19]" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-6 text-[#2D2D2D]/80 leading-relaxed text-lg" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      className="list-disc pl-6 mb-6 space-y-2 text-[#2D2D2D]/80 text-lg"
                      {...props}
                    />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="list-decimal pl-6 mb-6 space-y-2 text-[#2D2D2D]/80 text-lg"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => <li className="text-[#2D2D2D]/80" {...props} />,
                  a: ({ ...props }) => (
                    <a
                      className="text-[#2f4f2f] underline font-semibold hover:text-[#f5d26a]"
                      {...props}
                    />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className="border-l-4 border-[#f5d26a] pl-4 py-1 my-6 italic bg-[#fdf7f2] p-4 rounded-r-lg"
                      {...props}
                    />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-bold text-[#4b2e19]" {...props} />
                  ),
                }}
              >
                {blog.Content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-[#f5d26a]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4b2e19]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </main>
  );
}
