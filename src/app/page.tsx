
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

type BannerMedia = {
  id: number;
  name: string;
  mime: string;
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    large?: { url: string };
  };
};

type ClientImage = {
  id: number;
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
  };
};

type Client = {
  id: number;
  Name: string;
  Review: string;
  Rating: number;
  Designation: string | null;
  Image: ClientImage | null;
};

const BannerCarousel = () => {
  const [bannerItems, setBannerItems] = useState<BannerMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/banner?populate=*`);
        if (!res.ok) {
          throw new Error("Failed to fetch banner");
        }
        const data = await res.json();
        const bannerArray = data?.data?.Banner || [];
        
        if (bannerArray.length > 0) {
          setBannerItems(bannerArray);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || bannerItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, bannerItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  };

  // Minimum swipe distance (in pixels) to trigger slide change
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    // Prevent scrolling while swiping horizontally
    if (touchStart !== null) {
      const distance = Math.abs(touchStart - currentTouch);
      // Only prevent default if swiping horizontally (more horizontal than vertical)
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && bannerItems.length > 1) {
      // Swipe left - go to next slide
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
    
    if (isRightSwipe && bannerItems.length > 1) {
      // Swipe right - go to previous slide
      setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
    
    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag handlers for desktop - global listeners for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setMouseEnd(e.clientX);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      
      if (mouseStart !== null && mouseEnd !== null) {
        const distance = mouseStart - mouseEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && bannerItems.length > 1) {
          // Swipe left - go to next slide
          setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }
        
        if (isRightSwipe && bannerItems.length > 1) {
          // Swipe right - go to previous slide
          setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }
      }
      
      // Reset mouse positions
      setIsDragging(false);
      setMouseStart(null);
      setMouseEnd(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, mouseStart, mouseEnd, bannerItems.length]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setMouseEnd(null);
    setMouseStart(e.clientX);
  };

  if (loading) {
    return (
      <div className="w-full aspect-[720/300] flex items-center justify-center bg-[#fdf7f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-[720/300] flex items-center justify-center bg-red-100 text-red-800">
        Failed to load banner: {error}
      </div>
    );
  }

  if (bannerItems.length === 0) {
    return null;
  }

  const currentItem = bannerItems[currentIndex];
  const isVideo = currentItem.mime?.startsWith('video/');

  return (
    <div 
      className="relative w-full aspect-[720/300] overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      {/* Media Display */}
      <div className="relative w-full h-full">
        {isVideo ? (
          <video
            key={currentItem.id}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onMouseEnter={(e) => {
              e.currentTarget.pause();
              setIsAutoPlaying(false);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.play();
              setIsAutoPlaying(true);
            }}
          >
            <source src={`${BACKEND}${currentItem.url}`} type={currentItem.mime} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={`${BACKEND}${currentItem.url}`}
            alt={currentItem.alternativeText || currentItem.name || "Banner"}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        )}
      </div>

      {/* Dots Indicator */}
      {bannerItems.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (for auto-play) */}
      {bannerItems.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
          <div
            className="h-full bg-white/60 transition-all duration-100"
            style={{
              width: `${((currentIndex + 1) / bannerItems.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isLoading: cartLoading } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
  
  // Client reviews state
  const [clients, setClients] = useState<Client[]>([]);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState<string | null>(null);

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
        const products = data.data || [];
        setTopProducts(products);
        
        // Set default selected variant (first variant) for each product
        const defaultVariants: Record<number, number> = {};
        products.forEach((product: Product) => {
          if (product.Variants && product.Variants.length > 0) {
            defaultVariants[product.id] = product.Variants[0].id;
          }
        });
        setSelectedVariants(defaultVariants);
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setClientsLoading(true);
        const response = await fetch(`${BACKEND}/api/clients?populate=*`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        
        const data = await response.json();
        const clientsData = data.data || [];
        setClients(clientsData);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setClientsError(err instanceof Error ? err.message : 'Failed to load client reviews');
      } finally {
        setClientsLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  // Navigation handlers for client reviews
  const handlePreviousClient = () => {
    if (clients.length > 0) {
      setCurrentClientIndex((prev) => (prev - 1 + clients.length) % clients.length);
    }
  };

  const handleNextClient = () => {
    if (clients.length > 0) {
      setCurrentClientIndex((prev) => (prev + 1) % clients.length);
    }
  };

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
      <main className="relative">
        {/* Banner Carousel - Full Screen */}
        <BannerCarousel />
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
      </div>

      {/* Why Choose YugaFarms */}
      <section className="relative z-30 py-12 md:py-16 bg-[#4b2e19]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">WHY YUGAFARMS?</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              {[
                {
                  title: "100% Pure",
                  icon: "/images/pure.png"
                },
                {
                  title: "Farm Fresh",
                  icon: "/images/farmfresh.png"
                },
                {
                  title: "Made in Small Batches",
                  icon: "/images/madeinsmallbatches.png"
                },
                {
                  title: "Rooted in Tradition",
                  icon: "/images/rootedintradition.png"
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-28 h-28 md:w-32 md:h-32 border-2 border-transparent flex items-center justify-center mb-3 text-white transition-all duration-300 group-hover:scale-105 bg-red"
                    style={{
                      backgroundImage: `url(${item.icon})`,
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium transition-colors duration-300 group-hover:text-[#f5d26a]">{item.title}</span>
                </div>
              ))}
            </div>

            <button className="bg-white text-[#4b2e19] px-6 py-2.5 rounded-full font-semibold text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105">
              OUR STORY
            </button>
          </div>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="py-12 md:py-16 bg-[#eef2e9]">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
                Client <span className="text-[#4b2e19] relative">
                  Reviews
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#f5d26a] rounded-full"></div>
                </span>
              </h2>
              <p className="text-[#2D2D2D]/70 text-base">Hear what our satisfied customers have to say about their experiences.</p>
            </div>

            {/* Navigation Controls */}
            {clients.length > 1 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePreviousClient}
                  className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Previous review"
                >
                  <svg className="w-4 h-4 text-[#2D2D2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNextClient}
                  className="w-9 h-9 bg-[#4b2e19] hover:bg-[#2f4f2f] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Next review"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          {clientsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="w-72 h-72 md:w-80 md:h-80 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
              <div className="bg-white rounded-2xl p-6 md:p-8 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : clientsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">Error: {clientsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4b2e19] text-lg">No client reviews available at the moment.</p>
              <p className="text-[#2D2D2D]/70 mt-2">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Client Image */}
              <div className="relative">
                <div className="relative">
                  {/* Background Circle */}
                  <div className="w-72 h-72 md:w-80 md:h-80 bg-white rounded-full shadow-lg mx-auto relative overflow-hidden">
                    {/* Overlay Circle with Client Image */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 w-60 h-60 md:w-64 md:h-64 bg-gradient-to-br from-[#eef2e9] to-[#f0f4e8] rounded-full overflow-hidden flex items-center justify-center">
                      {clients[currentClientIndex]?.Image ? (
                        <Image 
                          src={`${BACKEND}${clients[currentClientIndex].Image.url}`} 
                          alt={clients[currentClientIndex].Image.alternativeText || clients[currentClientIndex].Name || "Client"} 
                          width={256} 
                          height={256} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Image src="/images/client.png" alt="Client" width={256} height={256} className="w-auto h-full object-cover" />
                      )}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-16 h-16 md:w-20 md:h-20 border-2 border-[#f5d26a]/30 rounded-full"></div>
                  <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-12 h-12 md:w-14 md:h-14 border-2 border-[#4b2e19]/20 rounded-full"></div>
                </div>
              </div>

              {/* Right Side - Testimonial Card */}
              <div className="relative">
                {/* Chat Icon */}
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-10 h-10 md:w-12 md:h-12 bg-[#4b2e19] rounded-full flex items-center justify-center z-10">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>

                {/* Testimonial Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 ml-3 md:ml-4">
                  <div className="space-y-3">
                    {/* Quote */}
                    <p className="text-[#2D2D2D] text-base md:text-lg leading-relaxed">
                      &quot;{clients[currentClientIndex]?.Review || 'No review available.'}&quot;
                    </p>

                    {/* Reviewer Info */}
                    <div className="space-y-1">
                      <div className="font-bold text-[#2D2D2D] text-base md:text-lg">
                        {clients[currentClientIndex]?.Name || 'Anonymous'}
                      </div>
                      {clients[currentClientIndex]?.Designation && (
                        <div className="text-[#2D2D2D]/70 text-sm">
                          {clients[currentClientIndex].Designation}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <span className="text-[#4b2e19] font-bold text-sm md:text-base">
                        {clients[currentClientIndex]?.Rating?.toFixed(1) || '0.0'}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const rating = clients[currentClientIndex]?.Rating || 0;
                          return (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 md:w-5 md:h-5 ${i < Math.round(rating) ? 'text-[#f5d26a]' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dots Indicator for Multiple Reviews */}
          {clients.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {clients.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentClientIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentClientIndex
                      ? 'bg-[#4b2e19] w-8'
                      : 'bg-[#4b2e19]/30 hover:bg-[#4b2e19]/50 w-2'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
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