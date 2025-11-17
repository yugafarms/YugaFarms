'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";

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
  TopPicks: boolean;
  Variants: ProductVariant[];
  Tags: ProductTag[];
  Image: ProductImage[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export default function HoneyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isLoading: cartLoading } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch Honey products where TopPicks is false (exclude top picks)
        const response = await fetch(`${BACKEND}/api/products?filters[Type][$eq]=Honey&filters[TopPicks][$eq]=false&populate=*`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        const productsData = data.data || [];
        setProducts(productsData);
        
        // Set default selected variant (first variant) for each product
        const defaultVariants: Record<number, number> = {};
        productsData.forEach((product: Product) => {
          if (product.Variants && product.Variants.length > 0) {
            defaultVariants[product.id] = product.Variants[0].id;
          }
        });
        setSelectedVariants(defaultVariants);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductEmoji = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('wild') || titleLower.includes('forest')) return '🍯';
    if (titleLower.includes('acacia')) return '🌼';
    if (titleLower.includes('eucalyptus')) return '🌿';
    if (titleLower.includes('multi') || titleLower.includes('flower')) return '🌸';
    if (titleLower.includes('manuka')) return '👑';
    if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
    return '🍯';
  };

  const getProductGradient = (index: number) => {
    const gradients = [
      "from-[#f5d26a] to-[#e6b800]",
      "from-[#2f4f2f] to-[#4b2e19]",
      "from-[#8B4513] to-[#D2691E]",
      "from-[#2f4f2f] to-[#4b2e19]",
      "from-[#8B4513] to-[#D2691E]",
      "from-[#f5d26a] to-[#e6b800]"
    ];
    return gradients[index % gradients.length];
  };

  const getProductBadge = (index: number) => {
    const badges = ["Best Seller", "Popular", "Health", "Classic", "Premium", "Value"];
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


  if (loading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading our pure honey collection...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
         {/* Hero Section */}
         <div className="relative pt-5 md:pt-7">
           <div className="container mx-auto px-4">
             <div className="text-center mb-10">
               <div className="inline-block relative">
                 <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                   Pure <span className="text-[#f5d26a]">Honey</span> Collection
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto">
                 Raw, unfiltered honey straight from nature&apos;s bounty. Experience the pure sweetness and health benefits of authentic honey.
               </p>
             </div>
           </div>
         </div>

         {/* Wave into Honey Products */}
         <div aria-hidden className="relative z-20 -mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Honey Products Section */}
        <section className="py-16 md:py-20 bg-[#eef2e9]">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#4b2e19] text-lg">No honey products available at the moment.</p>
                  <p className="text-[#2D2D2D]/70 mt-2">Please check back later or contact us for more information.</p>
                </div>
              ) : (
                products.map((product, idx) => {
                  const emoji = getProductEmoji(product.Title);
                  const badge = getProductBadge(idx);
                  
                  // Calculate pricing from variants
                  const variants = product.Variants || [];
                  const hasVariants = variants.length > 0;
                  const selectedVariantId = selectedVariants[product.id];
                  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
                  
                  const handleVariantChange = (variantId: number) => {
                    setSelectedVariants(prev => ({
                      ...prev,
                      [product.id]: variantId
                    }));
                  };

                  const finalPrice = selectedVariant ? selectedVariant.Price - (selectedVariant.Discount || 0) : 0;
                  const originalPrice = selectedVariant ? selectedVariant.Price : 0;
                  const savings = originalPrice - finalPrice;

                  return (
                    <div key={product.id} className="rounded-2xl border border-[#4b2e19]/15 bg-white hover:shadow-lg transition-all duration-300 group">
                      {/* Product Image */}
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative h-40 bg-gradient-to-br from-[#f5d26a]/20 to-[#f5d26a]/10 rounded-t-2xl border-b border-[#4b2e19]/10 flex items-center justify-center overflow-hidden cursor-pointer">
                          {product.Image && product.Image.length > 0 ? (
                            <Image
                              src={`${BACKEND}${product.Image[0].url}`}
                              alt={product.Image[0].alternativeText || product.Title}
                              width={400}
                              height={160}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-5xl">{emoji}</span>
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
                      <div className="p-4 space-y-3">
                        {/* Title */}
                        <div>
                          <Link href={`/product/${product.id}`} className="block group">
                            <h3 className="text-base font-semibold text-[#2D2D2D] mb-1 group-hover:text-[#4b2e19] transition-colors line-clamp-2">{product.Title}</h3>
                          </Link>
                          <p className="text-[#2D2D2D]/60 text-xs font-medium line-clamp-1">{product.PunchLine}</p>
                        </div>

                        {/* Size Dropdown with Pricing */}
                        {hasVariants && (
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-[#2D2D2D]">Select Size:</label>
                            <select
                              value={selectedVariantId || variants[0]?.id}
                              onChange={(e) => handleVariantChange(Number(e.target.value))}
                              className="w-full border border-[#4b2e19]/20 rounded-lg px-3 py-2 text-sm text-[#2D2D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a] cursor-pointer"
                            >
                              {variants.map((variant) => {
                                const variantPrice = variant.Price - (variant.Discount || 0);
                                const variantOriginalPrice = variant.Price;
                                const variantSavings = variantOriginalPrice - variantPrice;
                                return (
                                  <option key={variant.id} value={variant.id}>
                                    {variant.Weight}g - ₹{variantPrice}
                                    {variantSavings > 0 && ` (Save ₹${variantSavings})`}
                                    {variant.Stock <= 0 && ' - Out of Stock'}
                                  </option>
                                );
                              })}
                            </select>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#2D2D2D]/70">
                                {selectedVariant?.Weight}g
                              </span>
                              {savings > 0 && (
                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                  Save ₹{savings}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Price and Add to Cart */}
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-[#4b2e19]">₹{finalPrice}</span>
                              {savings > 0 && (
                                <span className="text-sm text-[#2D2D2D]/60 line-through">₹{originalPrice}</span>
                              )}
                            </div>
                            <div className="text-xs text-[#2D2D2D]/70 mt-0.5">
                              {product.NumberOfPurchase}+ bought
                            </div>
                          </div>
                          <button
                            className="bg-[#2f4f2f] text-white text-xs px-4 py-2 rounded-full hover:bg-[#3d6d3d] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            onClick={() => {
                              if (selectedVariant) {
                                handleAddToCart(product, selectedVariant);
                              }
                            }}
                            disabled={cartLoading || !hasVariants || !selectedVariant || (selectedVariant.Stock <= 0)}
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

        {/* Why Our Honey Section */}
        {/* <section className="py-16 md:py-20 bg-gradient-to-br bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Why Choose Our Honey?</h2>
              <p className="text-lg text-[#2D2D2D]/70 max-w-2xl mx-auto">
                Every jar of our honey is a testament to nature&apos;s perfection and our commitment to purity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🐝",
                  title: "Raw & Unfiltered",
                  description: "Pure, raw honey straight from the hive, preserving all natural enzymes and health benefits."
                },
                {
                  icon: "🔬",
                  title: "Lab Tested Quality",
                  description: "Every batch undergoes rigorous testing to ensure purity, authenticity, and quality standards."
                },
                {
                  icon: "🌺",
                  title: "Single Source",
                  description: "Each honey variety comes from specific flower sources, ensuring consistent flavor and properties."
                },
                {
                  icon: "✨",
                  title: "No Additives",
                  description: "Pure, natural honey without any additives, preservatives, or artificial ingredients."
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center space-y-4 p-6 bg-white/50 rounded-2xl border border-[#4b2e19]/10">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#4b2e19]">{item.title}</h3>
                  <p className="text-[#2D2D2D]/70 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

         {/* Wave back to cream before Footer */}
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
