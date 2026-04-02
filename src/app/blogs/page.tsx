'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type BlogSection = {
  id: number;
  documentId: string;
  Title: string;
  sluge: string;
  Content: string;
  CoverImage: {
    id: number;
    url: string;
    alternativeText: string | null;
  } | null;
  publishedAt: string;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/blog-sections?populate=*&sort=publishedAt:desc`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden">
        {/* Banner Section */}
        <div className="relative pt-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block relative">
                <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                  Our <span className="text-[#f5d26a]">Blogs</span>
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
              </div>
              <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-4xl mx-auto leading-relaxed">
                Discover insights, stories, and tips about pure ghee, natural honey, and our traditional farming practices.
              </p>
            </div>
          </div>
        </div>

        {/* Wave Splitter */}
        <div aria-hidden className="relative z-20 -mt-2">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
            <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        <section className="py-6 bg-[#eef2e9] min-h-[500px]">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white/50 p-4 h-96"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-xl font-semibold mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                 <p className="text-[#4b2e19] text-2xl font-bold">No blogs found.</p>
                 <p className="text-[#2D2D2D]/70 mt-2">Check back soon for new articles!</p>
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog) => (
                    <Link
                      href={`/blogs/${blog.sluge}`}
                      key={blog.id}
                      className="group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#4b2e19]/10"
                    >
                      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                        {blog.CoverImage?.url ? (
                           <Image
                             src={`${BACKEND}${blog.CoverImage.url}`}
                             alt={blog.CoverImage.alternativeText || blog.Title}
                             fill
                             className="object-cover group-hover:scale-105 transition-transform duration-500"
                             unoptimized={true}
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-4xl bg-[#f5d26a]/20">
                             📰
                           </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3 text-sm text-[#4b2e19]/60 font-medium">
                          <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#4b2e19] mb-3 group-hover:text-[#2f4f2f] transition-colors line-clamp-2">
                          {blog.Title}
                        </h2>
                        {blog.Content && (
                          <p className="text-[#2D2D2D]/70 line-clamp-3 mb-4 flex-1">
                            {blog.Content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                          </p>
                        )}
                        <div className="mt-auto pt-4 border-t border-[#4b2e19]/10 text-sm font-bold text-[#2f4f2f] group-hover:text-[#4b2e19] flex items-center gap-2">
                           Read More 
                           <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
               </div>
            )}
          </div>
        </section>

        {/* Wave back to cream */}
        <div aria-hidden className="relative z-20 -mt-2 bg-[#fdf7f2]">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
            <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z"></path>
          </svg>
        </div>

      </main>
      <Footer />
    </>
  );
}
