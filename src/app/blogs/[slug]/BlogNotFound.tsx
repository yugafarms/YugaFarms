import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] pt-6 md:pt-10 pb-12">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-sm border border-[#4b2e19]/10">
          <h1 className="text-4xl font-bold text-[#4b2e19] mb-4">Oops!</h1>
          <p className="text-xl text-[#2D2D2D]/70 mb-8">Blog not found</p>
          <Link
            href="/blogs"
            className="inline-block bg-[#4b2e19] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2f4f2f] transition-all hover:scale-105 shadow-md"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}
