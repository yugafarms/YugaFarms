import Link from "next/link";
import { marked } from "marked";
import type { BlogSection } from "@/lib/strapiPublic";
import { getBackendUrl } from "@/lib/strapiPublic";

marked.setOptions({ gfm: true });

/**
 * Turn Strapi body into HTML on the server so simple HTTP fetchers see real
 * article markup in the initial response (no react-markdown / client streaming).
 */
function postBodyHtml(content: string): string {
  const raw = (content || "").trim();
  if (!raw) return "";
  if (raw.startsWith("<")) {
    return raw;
  }
  return marked(raw, { async: false }) as string;
}

const bodyProseClass =
  "post-body max-w-none text-[#2D2D2D]/80 text-lg leading-relaxed " +
  "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-[#4b2e19] " +
  "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-[#4b2e19] " +
  "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-[#4b2e19] " +
  "[&_p]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 " +
  "[&_li]:text-[#2D2D2D]/80 [&_a]:text-[#2f4f2f] [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-[#f5d26a] " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-[#f5d26a] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-[#fdf7f2] [&_blockquote]:p-4 [&_blockquote]:rounded-r-lg " +
  "[&_strong]:font-bold [&_strong]:text-[#4b2e19]";

export default function BlogArticle({ blog }: { blog: BlogSection }) {
  const backend = getBackendUrl();
  const coverSrc = blog.CoverImage?.url
    ? blog.CoverImage.url.startsWith("http")
      ? blog.CoverImage.url
      : `${backend}${blog.CoverImage.url}`
    : null;

  const bodyHtml = postBodyHtml(blog.Content || "");

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
              <img
                src={coverSrc}
                alt={blog.CoverImage?.alternativeText || blog.Title}
                className="absolute inset-0 w-full h-full object-cover"
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

            {bodyHtml ? (
              <div className={bodyProseClass} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            ) : (
              <p className="text-[#2D2D2D]/70">No article body was provided for this post.</p>
            )}
          </div>
        </article>
      </div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-[#f5d26a]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4b2e19]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </main>
  );
}
