
'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type ProductVariant = {
  id: number;
  Price: number;
  Discount: number;
  Weight: number;
  Stock: number;
};

type ProductTag = {
  id: number;
  Value: string;
};

type ProductImage = {
  id: number;
  url: string;
  alternativeText?: string;
};

type Product = {
  id: number;
  Title: string;
  Description: string;
  Rating: number;
  PunchLine: string;
  NumberOfPurchase: number;
  Type: "Ghee" | "Honey";
  Variants: ProductVariant[];
  Tags: ProductTag[];
  Image: ProductImage[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isLoading: cartLoading } = useCart();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        // Fetch products and sort by NumberOfPurchase to get top products
        const response = await fetch(`${BACKEND}/api/products?populate=*&sort=NumberOfPurchase:desc&pagination[limit]=3`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setTopProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const getProductEmoji = (title: string, type: string) => {
    const titleLower = title.toLowerCase();
    if (type === "Ghee") {
      if (titleLower.includes('a2') || titleLower.includes('desi')) return '🧈';
      if (titleLower.includes('classic') || titleLower.includes('cow')) return '🐄';
      if (titleLower.includes('buffalo')) return '🥛';
      if (titleLower.includes('organic')) return '🌿';
      if (titleLower.includes('spiced') || titleLower.includes('spice')) return '🌶️';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🧈';
    } else if (type === "Honey") {
      if (titleLower.includes('wild') || titleLower.includes('forest')) return '🍯';
      if (titleLower.includes('acacia')) return '🌼';
      if (titleLower.includes('eucalyptus')) return '🌿';
      if (titleLower.includes('multi') || titleLower.includes('flower')) return '🌸';
      if (titleLower.includes('manuka')) return '👑';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🍯';
    }
    return '🥜'; // Default for oils
  };

  const getProductBadge = (index: number) => {
    const badges = ["Best Seller", "Popular", "Premium", "New", "Family Pack", "Value"];
    return badges[index % badges.length];
  };

  const handleAddToCart = async (product: Product, variant: ProductVariant) => {
    try {
      await addToCart({
        productId: product.id,
        variantId: variant.id,
        price: variant.Price - (variant.Discount || 0),
        weight: variant.Weight,
        productTitle: product.Title,
        productImage: product.Image && product.Image.length > 0 ? `${BACKEND}${product.Image[0].url}` : undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <>
      <TopBar />
      <main
        className="min-h-[90vh] max-h-screen relative overflow-hidden pt-20"
      >
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay for slight dimming if needed */}
        <div className="absolute inset-0 bg-[#fdf7f2]/20 z-10 -mt-20"></div>

        {/* Brand Name on top left */}
        <div className="space-x-2 z-40 w-1/3 mt-[7%] ml-[12%] relative">
          <div className="text-[#2D2D2D] tracking-wide text-[80px] font-[Pacifico] transition-colors duration-300 hover:text-[#4b2e19]">YugaFarms</div>
          <div className="text-[#2D2D2D] text-xl font-semibold mt-2 pl-2">Pure Goodness, Straight from <br /> Our Farm to Your Table</div>
        </div>

        <Link
          href="/ghee"
          className="absolute bottom-10 bg-[#4b2e19] text-white px-6 py-3 rounded-full left-[50%] transform translate-x-[-50%] z-40 transition-all duration-300 hover:bg-[#2f4f2f] hover:scale-105"
        >
          SHOP NOW
        </Link>
      </main>

      {/* Wave into Our Top Picks */}
      <div aria-hidden className="relative z-20 -mt-2">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
          <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Our Top Picks (soft sage background) */}
      <div className="bg-[#eef2e9] py-12 md:py-16">
        <section className="relative z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19]">Our Top Picks</h2>
                <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-[#f5d26a] rounded-full"></div>
              </div>
              <Link href="/ghee" className="text-[#2f4f2f] hover:text-[#4b2e19] transition-colors duration-300 font-medium">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="rounded-2xl border border-[#4b2e19]/15 bg-white animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // Error state
                <div className="col-span-full text-center py-12">
                  <p className="text-red-600 text-lg mb-4">Error: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : topProducts.length === 0 ? (
                // No products state
                <div className="col-span-full text-center py-12">
                  <p className="text-[#4b2e19] text-lg">No products available at the moment.</p>
                  <p className="text-[#2D2D2D]/70 mt-2">Please check back later.</p>
                </div>
              ) : (
                topProducts.map((product, idx) => {
                  const emoji = getProductEmoji(product.Title, product.Type);
                  const badge = getProductBadge(idx);
                  const features = product.Tags.map(tag => tag.Value);

                  // Calculate pricing from variants
                  const variants = product.Variants || [];
                  const hasVariants = variants.length > 0;
                  const minPrice = hasVariants ? Math.min(...variants.map(v => v.Price - (v.Discount || 0))) : 0;
                  const maxPrice = hasVariants ? Math.max(...variants.map(v => v.Price - (v.Discount || 0))) : 0;
                  const minOriginalPrice = hasVariants ? Math.min(...variants.map(v => v.Price)) : 0;
                  const savings = minOriginalPrice - minPrice;

                  return (
                    <div key={product.id} className="rounded-2xl border border-[#4b2e19]/15 bg-white hover:shadow-lg transition-all duration-300 group">
                      {/* Product Image */}
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative h-48 bg-gradient-to-br from-[#f5d26a]/20 to-[#f5d26a]/10 rounded-t-2xl border-b border-[#4b2e19]/10 flex items-center justify-center overflow-hidden cursor-pointer">
                          {product.Image && product.Image.length > 0 ? (
                            <Image
                              src={`${BACKEND}${product.Image[0].url}`}
                              alt={product.Image[0].alternativeText || product.Title}
                              width={400}
                              height={192}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-6xl">{emoji}</span>
                          )}
                          <div className="absolute top-3 left-3">
                            <div className="text-xs bg-[#f5d26a] text-[#4b2e19] px-2 py-1 rounded-full font-semibold">{badge}</div>
                          </div>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs font-semibold text-[#2D2D2D]">{product.Rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-5 space-y-4">
                        {/* Title and Rating */}
                        <div>
                          <Link href={`/product/${product.id}`} className="block group">
                            <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2 group-hover:text-[#4b2e19] transition-colors">{product.Title}</h3>
                          </Link>
                          <p className="text-[#2D2D2D]/60 text-sm font-medium mb-2">{product.PunchLine}</p>
                          <div className="flex items-center justify-between text-sm text-[#2D2D2D]/70">
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg key={i} className="w-3 h-3 text-[#f5d26a]" fill={i < Math.floor(product.Rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs">({product.NumberOfPurchase} bought)</span>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        {features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {features.slice(0, 3).map((feature, featureIdx) => (
                              <span key={featureIdx} className="text-xs bg-[#eef2e9] text-[#4b2e19] px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Weight Selection */}
                        {hasVariants && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2D2D2D]">Available Sizes:</label>
                            <div className="text-xs text-[#2D2D2D]/70">
                              {variants.length > 1 ? `${variants.length} sizes available` : `${variants[0]?.Weight}g`}
                            </div>
                          </div>
                        )}

                        {/* Price and Add to Cart */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {hasVariants && (
                                <>
                                  <span className="text-xl font-bold text-[#4b2e19]">₹{minPrice}</span>
                                  {variants.length > 1 && (
                                    <span className="text-sm text-[#2D2D2D]/60">- ₹{maxPrice}</span>
                                  )}
                                  {savings > 0 && (
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                      Save ₹{savings}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="text-xs text-[#2D2D2D]/70">
                              {product.NumberOfPurchase}+ happy customers
                            </div>
                          </div>
                          <button
                            className="bg-[#2f4f2f] text-white text-sm px-4 py-2 rounded-full hover:bg-[#3d6d3d] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                              if (variants[0]) {
                                handleAddToCart(product, variants[0]);
                              }
                            }}
                            disabled={cartLoading || !hasVariants}
                          >
                            {cartLoading ? 'Adding...' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Why Choose YugaFarms */}
      <section className="relative z-30 py-20 bg-[#4b2e19]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">WHY YUGAFARMS?</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              {[
                {
                  title: "100% Pure",
                  // icon: (
                  //   <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  //   </svg>
                  // )
                  icon: "/images/pure.png"
                },
                {
                  title: "Farm Fresh",
                  // icon: (
                  //   <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  //   </svg>
                  // )
                  icon: "/images/farmfresh.png"
                },
                {
                  title: "Made in Small Batches",
                  // icon: (
                  //   <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  //   </svg>
                  // )
                  icon: "/images/madeinsmallbatches.png"
                },
                {
                  title: "Rooted in Tradition",
                  // icon: (
                  //   <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  //   </svg>
                  // )
                  icon: "/images/rootedintradition.png"
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-40 h-40 border-2 border-transparent flex items-center justify-center mb-4 text-white transition-all duration-300 group-hover:scale-105 bg-red"
                    style={{
                      backgroundImage: `url(${item.icon})`,
                      backgroundSize: '130% 130%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                  </div>
                  <span className="text-white text-sm font-medium transition-colors duration-300 group-hover:text-[#f5d26a]">{item.title}</span>
                </div>
              ))}
            </div>

            <button className="bg-white text-[#4b2e19] px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
              OUR STORY
            </button>
          </div>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="py-16 md:py-20 bg-[#eef2e9]">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-2">
                Client <span className="text-[#4b2e19] relative">
                  Reviews
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#f5d26a] rounded-full"></div>
                </span>
              </h2>
              <p className="text-[#2D2D2D]/70 text-lg">Hear what our satisfied customers have to say about their experiences.</p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-[#2D2D2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-[#4b2e19] hover:bg-[#2f4f2f] rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Map-like Visual */}
            <div className="relative">
              <div className="relative">
                {/* Background Circle */}
                <div className="w-96 h-96 bg-white rounded-full shadow-lg mx-auto relative overflow-hidden">
                  {/* Overlay Circle */}
                  <div className="absolute top-8 left-8 w-80 h-80 bg-gradient-to-br from-[#eef2e9] to-[#f0f4e8] rounded-full"></div>

                  {/* Product Regions */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2 p-8">

                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[#f5d26a]/30 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-[#4b2e19]/20 rounded-full"></div>
              </div>
            </div>

            {/* Right Side - Testimonial Card */}
            <div className="relative">
              {/* Chat Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#4b2e19] rounded-full flex items-center justify-center z-10">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              {/* Testimonial Card */}
              <div className="bg-white rounded-2xl p-8 ml-4">
                <div className="space-y-4">
                  {/* Quote */}
                  <p className="text-[#2D2D2D] text-lg leading-relaxed">
                    &quot;The quality of YugaFarms&apos; A2 ghee is absolutely exceptional! Every time I cook with it, the aroma fills my entire kitchen just like my grandmother&apos;s recipes. The rotis puff up perfectly and the taste is divine.&quot;
                  </p>

                  {/* Reviewer Info */}
                  <div className="space-y-1">
                    <div className="font-bold text-[#2D2D2D] text-lg">Meera Sharma</div>
                    <div className="text-[#2D2D2D]/70">Home Chef & Food Blogger</div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#4b2e19] font-bold">5.0</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Testimonials (Hidden by default, can be shown with navigation) */}
          <div className="hidden">
            {/* Second Testimonial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                {/* Same map visual */}
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#4b2e19] rounded-full flex items-center justify-center z-10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl p-8 ml-4">
                  <div className="space-y-4">
                    <p className="text-[#2D2D2D] text-lg leading-relaxed">
                      &quot;After trying countless oils, I finally found one that doesn&apos;t feel heavy on the stomach. My pakoras are crisp and light, just like my mother used to make. The difference in quality is remarkable.&quot;
                    </p>
                    <div className="space-y-1">
                      <div className="font-bold text-[#2D2D2D] text-lg">Karthik Reddy</div>
                      <div className="text-[#2D2D2D]/70">Restaurant Owner</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#4b2e19] font-bold">4.8</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Tradition Banner - Creative Heritage Showcase */}
      <section className="relative pb-20 md:pb-24 bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] overflow-hidden">
        {/* Wave back to cream before Footer */}
        <div aria-hidden className="relative z-20 mb-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
            <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z"></path>
          </svg>
        </div>
        {/* Organic background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#f5d26a]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4b2e19]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2f4f2f]/5 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Rooted in Ancient Wisdom</h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
            </div>
            <p className="text-lg text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto">
              Crafted the slow way, just like our grandmothers did — with patience, care, and respect for the land.
            </p>
          </div>

          {/* Tradition showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-xl">
                    🏺
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Bilona-Churned Excellence</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">Our ghee is made using the traditional bilona method — a slow, patient process that preserves every ounce of nutrition and flavor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2f4f2f] to-[#4b2e19] rounded-full flex items-center justify-center text-xl">
                    🌿
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Cold-Pressed Purity</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">No heat, no chemicals, no compromise. Our oils retain their natural goodness through gentle cold-pressing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#D2691E] rounded-full flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Farm-to-Table Freshness</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">Directly sourced from small family farms, ensuring maximum freshness and supporting local communities.</p>
                  </div>
                </div>
              </div>

              {/* Tradition badges */}
              <div className="flex flex-wrap gap-4 pt-6">
                <div className="bg-[#f5d26a] text-[#4b2e19] px-6 py-3 rounded-full font-semibold">
                  🏺 Bilona-churned
                </div>
                <div className="bg-[#4b2e19] text-white px-6 py-3 rounded-full font-semibold">
                  🌿 Cold-pressed
                </div>
                <div className="bg-white border-2 border-[#4b2e19] text-[#4b2e19] px-6 py-3 rounded-full font-semibold">
                  🌾 No preservatives
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="relative">
                <Image src="/images/tradition.png" alt="Tradition" width={600} height={600} className="w-[90%] h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}