import Image from "next/image";
import Link from "next/link";
import type { BlogSection } from "@/lib/strapiPublic";
import { getBackendUrl } from "@/lib/strapiPublic";

function excerptFromContent(htmlOrText: string): string {
  const plain = htmlOrText.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  if (plain.length <= 155) return plain;
  return `${plain.slice(0, 152)}…`;
}

/**
 * Server-rendered blog index — real `<a href>`, titles, and excerpts in initial HTML for crawlers.
 */
export default function BlogsListing({ blogs }: { blogs: BlogSection[] }) {
  const backend = getBackendUrl();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden">
      <div className="relative pt-6 md:pt-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block relative">
              <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                Our <span className="text-[#f5d26a]">Blogs</span>
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full" />
            </div>
            <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-4xl mx-auto leading-relaxed">
              Discover insights, stories, and tips about pure ghee, natural honey, and our traditional
              farming practices.
            </p>
          </div>
        </div>
      </div>

      <div aria-hidden className="relative z-20 -mt-2">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current"
        >
          <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z" />
        </svg>
      </div>

      <section className="py-6 bg-[#eef2e9] min-h-[500px]" aria-label="Blog articles">
        <div className="container mx-auto px-4">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#4b2e19] text-2xl font-bold">No blogs found.</p>
              <p className="text-[#2D2D2D]/70 mt-2">Check back soon for new articles!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article key={blog.id}>
                  <Link
                    prefetch
                    href={`/blogs/${blog.sluge}`}
                    className="group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#4b2e19]/10 h-full"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                      {blog.CoverImage?.url ? (
                        <Image
                          src={
                            blog.CoverImage.url.startsWith("http")
                              ? blog.CoverImage.url
                              : `${backend}${blog.CoverImage.url}`
                          }
                          alt={blog.CoverImage.alternativeText || blog.Title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-[#f5d26a]/20">
                          📰
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <time
                        dateTime={blog.publishedAt}
                        className="flex items-center gap-2 mb-3 text-sm text-[#4b2e19]/60 font-medium"
                      >
                        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <h2 className="text-2xl font-bold text-[#4b2e19] mb-3 group-hover:text-[#2f4f2f] transition-colors line-clamp-2">
                        {blog.Title}
                      </h2>
                      {blog.Content ? (
                        <p className="text-[#2D2D2D]/70 line-clamp-3 mb-4 flex-1">
                          {excerptFromContent(blog.Content)}
                        </p>
                      ) : null}
                      <div className="mt-auto pt-4 border-t border-[#4b2e19]/10 text-sm font-bold text-[#2f4f2f] group-hover:text-[#4b2e19] flex items-center gap-2">
                        Read more
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {blogs.length > 0 ? (
            <nav
              aria-label="All blog article links"
              className="mt-12 border-t border-[#4b2e19]/15 pt-8 pb-4"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b2e19] mb-4">
                All articles
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-[15px] text-[#2D2D2D]">
                {blogs.map((blog) => (
                  <li key={`list-${blog.id}`}>
                    <Link
                      prefetch
                      href={`/blogs/${blog.sluge}`}
                      className="text-[#2f4f2f] underline underline-offset-2 hover:text-[#4b2e19]"
                    >
                      {blog.Title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </section>

      <div aria-hidden className="relative z-20 -mt-2 bg-[#fdf7f2]">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current"
        >
          <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>
    </main>
  );
}
