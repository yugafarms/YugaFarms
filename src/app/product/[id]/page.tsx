'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openInfoTab, setOpenInfoTab] = useState<string | null>('description');
  const { addToCart, isLoading: cartLoading, items: cartItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // First try to get the product with publication state
        let response = await fetch(`${BACKEND}/api/products/${params.id}?publicationState=live&populate=*`);

        if (!response.ok) {
          // If that fails, try without publication state
          response = await fetch(`${BACKEND}/api/products/${params.id}?populate=*`);
        }

        if (!response.ok) {
          // If individual fetch fails, try to find the product in the list
          const listResponse = await fetch(`${BACKEND}/api/products?populate=*`);
          if (listResponse.ok) {
            const listData = await listResponse.json();
            const foundProduct = listData.data?.find((p: Product) => p.id.toString() === params.id);
            if (foundProduct) {
              setProduct(foundProduct);
              if (foundProduct.Variants?.length > 0) {
                setSelectedVariant(foundProduct.Variants[0]);
              }
              setLoading(false);
              return;
            }
          }
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data.data);

        // Set the first variant as selected by default
        if (data.data?.Variants?.length > 0) {
          setSelectedVariant(data.data.Variants[0]);
        }

        // Track ViewContent event with Meta Pixel
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq('track', 'ViewContent', {
            content_name: data.data.Title,
            content_ids: [data.data.id.toString()],
            content_type: 'product',
            value: data.data.Variants?.[0]?.Price || 0,
            currency: 'INR'
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();

      // Check if product is liked
      const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '{}');
      if (likedProducts[params.id as string]) {
        setIsLiked(true);
      }
    }
  }, [params.id]);

  const toggleLike = () => {
    if (!product) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '{}');
    if (newLikedState) {
      likedProducts[product.id] = true;
    } else {
      delete likedProducts[product.id];
    }
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        price: selectedVariant.Price - (selectedVariant.Discount || 0),
        weight: selectedVariant.Weight,
        productTitle: product.Title,
        productImage: product.Image && product.Image.length > 0 ? `${BACKEND}${product.Image[0].url}` : undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;

    try {
      setIsCartOpen(false);
      await addToCart(
        {
          productId: product.id,
          variantId: selectedVariant.id,
          price: selectedVariant.Price - (selectedVariant.Discount || 0),
          weight: selectedVariant.Weight,
          productTitle: product.Title,
          productImage: product.Image && product.Image.length > 0 ? `${BACKEND}${product.Image[0].url}` : undefined,
        },
        { openCart: false }
      );

      router.push('/checkout');
    } catch (error) {
      console.error("Error during buy now:", error);
    }
  };

  const isItemInCart = () => {
    if (!product || !selectedVariant) return false;
    return cartItems.some(item => item.productId === product.id && item.variantId === selectedVariant.id);
  };

  const getCartItemQuantity = () => {
    if (!product || !selectedVariant) return 0;
    const cartItem = cartItems.find(item => item.productId === product.id && item.variantId === selectedVariant.id);
    return cartItem ? cartItem.quantity : 0;
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
    } else {
      if (titleLower.includes('wild') || titleLower.includes('forest')) return '🍯';
      if (titleLower.includes('acacia')) return '🌼';
      if (titleLower.includes('eucalyptus')) return '🌿';
      if (titleLower.includes('multi') || titleLower.includes('flower')) return '🌸';
      if (titleLower.includes('manuka')) return '👑';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🍯';
    }
  };

  const getProductGradient = (type: string) => {
    if (type === "Ghee") {
      return "from-[#f5d26a] to-[#e6b800]";
    } else {
      return "from-[#f5d26a] to-[#e6b800]";
    }
  };

  const formatUnit = (weight: number, type: string) => {
    if (type === "Ghee") {
      if (weight >= 1000) {
        const liters = weight / 1000;
        return liters % 1 === 0 ? `${liters} L` : `${liters.toFixed(1)} L`;
      }
      return `${weight} ml`;
    } else {
      if (weight >= 1000) {
        const kg = weight / 1000;
        return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
      }
      return `${weight} g`;
    }
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading product details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error: {error || 'Product not found'}</p>
              <button
                onClick={() => router.back()}
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentPrice = selectedVariant ? (selectedVariant.Price - (selectedVariant.Discount || 0)) : 0;
  const originalPrice = selectedVariant ? selectedVariant.Price : 0;
  const savings = selectedVariant ? (selectedVariant.Discount || 0) : 0;
  const emoji = getProductEmoji(product.Title, product.Type);
  const gradient = getProductGradient(product.Type);
  const itemInCart = isItemInCart();
  const cartQuantity = getCartItemQuantity();

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-0">
          <nav className="flex items-center space-x-2 text-sm text-[#2D2D2D]/70 mb-0 w-full overflow-hidden">
            <Link href="/" className="hover:text-[#4b2e19] transition-colors shrink-0 whitespace-nowrap">Home</Link>
            <span className="shrink-0">/</span>
            <Link href={`/${product.Type.toLowerCase()}`} className="hover:text-[#4b2e19] transition-colors capitalize shrink-0 whitespace-nowrap">
              {product.Type}
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-[#4b2e19] font-medium truncate min-w-0">{product.Title}</span>
          </nav>
        </div>

        {/* Product Detail Section */}
        <section className="py-4 md:py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Product Images */}
              <div className="flex flex-col gap-6">
                {/* Main Image */}
                <div className={`relative w-full bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center overflow-hidden aspect-square`}>
                  {product.Image && product.Image.length > 0 ? (
                    <Image
                      src={`${BACKEND}${product.Image[selectedImageIndex].url}`}
                      alt={product.Image[selectedImageIndex].alternativeText || product.Title}
                      width={800}
                      height={800}
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="w-full h-full object-cover aspect-square"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <span className="text-9xl relative z-10 drop-shadow-lg">{emoji}</span>
                    </>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-lg font-bold text-[#2D2D2D]">{product.Rating}</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {product.Image && product.Image.length > 0 && (
                  <div className="flex gap-4 flex-row overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory">
                    {product.Image.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 shrink-0 snap-start rounded-xl overflow-hidden border-2 transition-all aspect-square ${selectedImageIndex === index
                          ? 'border-[#4b2e19] shadow-lg'
                          : 'border-transparent hover:border-[#4b2e19]/50'
                          }`}
                      >
                        <Image
                          src={`${BACKEND}${image.url}`}
                          alt={image.alternativeText || `${product.Title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="flex flex-col gap-6">
                {/* Title, Rating, and Price Details */}
                <div className="bg-white border-2 border-[#eef2e9] p-5 md:p-6 rounded-xl shadow-sm">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-1">{product.Title}</h1>
                  <p className="text-sm md:text-base text-[#2D2D2D]/80 font-medium mb-3">{product.PunchLine}</p>

                  {/* Rating and Sales */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center gap-[2px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 md:w-[18px] md:h-[18px] ${i < Math.floor(product.Rating) ? 'text-[#f5d26a]' : 'text-[#D1D1D1]'} fill-current`} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-[#2D2D2D] ml-1">{product.Rating}</span>
                    <span className="text-[#2D2D2D]/30 mx-1">|</span>
                    <span className="text-xs md:text-sm font-medium text-[#2D2D2D]/70">{product.NumberOfPurchase} Reviews</span>
                  </div>

                  {/* Price Block */}
                  <div>
                    <div className="flex items-end gap-3 mb-1">
                      <span className="text-[28px] md:text-3xl font-bold text-[#2D2D2D] leading-none">₹{currentPrice}</span>
                      {originalPrice > currentPrice && (
                        <span className="text-lg text-[#2D2D2D]/50 line-through mb-0.5">₹{originalPrice}</span>
                      )}
                    </div>
                    <p className="text-xs md:text-[13px] text-[#2D2D2D]/60 mb-4">MRP (incl. of all taxes)</p>

                    <div className="inline-block bg-[#f5d26a] text-[#4b2e19] text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-sm">
                      6% GST Cess included in MRP
                    </div>
                  </div>

                  {/* Short Description & Key Benefits */}
                  <div className="mt-6 pt-5 border-t border-[#eef2e9]">
                    <p className="text-[#2D2D2D]/80 text-[13px] md:text-[14px] leading-relaxed mb-5">
                      {/* {product.Type === 'Ghee' 
                        ? "India's finest certified Cultured Ghee crafted from desi cow milk using the ancient Vedic Bilona method. Free from preservatives, artificial flavors, and chemicals. Aids digestion, boosts immunity, and reduces inflammation."
                        : product.Description.substring(0, 150) + "..."} */}
                      {product.Description}
                    </p>
                    
                    {/* Benefit Icons */}
                    {product.Type === 'Ghee' && (
                      <div className="grid grid-cols-4 gap-2 text-center mt-2">
                        <div className="flex flex-col items-center group">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#f5d26a]/50 bg-[#fdf7f2] flex items-center justify-center mb-2 group-hover:bg-[#f5d26a] transition-colors">
                             <Image src="/images/bilona.png" alt="Bilona Churned" width={24} height={24} className="opacity-80 group-hover:opacity-100" />
                          </div>
                          <span className="text-[9px] md:text-[10px] font-bold text-[#4b2e19] uppercase leading-tight">Bilona<br/>Churned</span>
                        </div>
                        <div className="flex flex-col items-center group">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#f5d26a]/50 bg-[#483600] flex items-center justify-center mb-2 transition-colors">
                             <Image src="/images/pure.png" alt="A2 Cow Milk" width={24} height={24} className="opacity-80 group-hover:opacity-100" />
                          </div>
                          <span className="text-[9px] md:text-[10px] font-bold text-[#4b2e19] uppercase leading-tight">A2 Cow<br/>Milk</span>
                        </div>
                        <div className="flex flex-col items-center group">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#f5d26a]/50 bg-[#fdf7f2] flex items-center justify-center mb-2 group-hover:bg-[#f5d26a] transition-colors">
                             <Image src="/images/traditionalpreparation.png" alt="Woodfire Process" width={24} height={24} className="opacity-80 group-hover:opacity-100" />
                          </div>
                          <span className="text-[9px] md:text-[10px] font-bold text-[#4b2e19] uppercase leading-tight">Woodfire<br/>Process</span>
                        </div>
                        <div className="flex flex-col items-center group">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#f5d26a]/50 bg-[#483600] flex items-center justify-center mb-2 transition-colors">
                             <Image src="/images/madeinsmallbatches.png" alt="Small Batches" width={24} height={24} className="opacity-80 group-hover:opacity-100" />
                          </div>
                          <span className="text-[9px] md:text-[10px] font-bold text-[#4b2e19] uppercase leading-tight">Small<br/>Batches</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>



                {/* Tags/Features */}
                <div>
                  {/* <h3 className="text-2xl font-bold text-[#4b2e19] mb-3">Key Features</h3> */}
                  <div className="flex flex-wrap gap-3">
                    {product.Tags.map((tag, index) => (
                      <span key={index} className="bg-[#eef2e9] text-[#4b2e19] px-4 py-2 rounded-full font-medium text-sm">
                        {tag.Value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Variant Selection */}
                {product.Variants && product.Variants.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-3">Available Sizes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.Variants.map((variant, index) => {
                        const variantPrice = variant.Price - (variant.Discount || 0);
                        const variantSavings = variant.Discount || 0;
                        const isSelected = selectedVariant?.id === variant.id;

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedVariant(variant)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                              ? 'border-[#4b2e19] bg-[#4b2e19]/5 shadow-lg'
                              : 'border-[#4b2e19]/20 hover:border-[#4b2e19]/50 bg-white'
                              }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-[#4b2e19]">{formatUnit(variant.Weight, product.Type)}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-[#4b2e19]">₹{variantPrice}</div>
                                {variantSavings > 0 && (
                                  <div className="text-sm text-red-600">Save ₹{variantSavings}</div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add to Cart Actions - Desktop Only */}
                <div className="hidden md:block sticky bottom-6 z-40 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-[#f5d26a]/30">

                  <div className="flex gap-4">
                    {itemInCart ? (
                      <>
                        <div className="flex-1 bg-green-100 text-green-800 py-4 rounded-xl font-semibold text-center border-2 border-green-300 text-lg">
                          ✓ In Cart ({cartQuantity})
                        </div>
                        <Link
                          href="/cart"
                          className="px-6 py-4 border-2 border-[#4b2e19] text-[#4b2e19] rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          className="flex-1 bg-[#4b2e19] text-white py-4 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          onClick={handleAddToCart}
                          disabled={cartLoading || !selectedVariant}
                        >
                          {cartLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                          className="flex-1 bg-white border-2 border-[#4b2e19] text-[#4b2e19] py-4 rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          onClick={handleBuyNow}
                          disabled={cartLoading || !selectedVariant}
                        >
                          {cartLoading ? 'Processing...' : 'Buy Now'}
                        </button>
                        <button
                          onClick={toggleLike}
                          className={`px-6 py-4 border-2 border-[#4b2e19] rounded-xl font-semibold transition-colors duration-300 ${isLiked
                            ? 'bg-[#4b2e19] text-white'
                            : 'text-[#4b2e19] hover:bg-[#4b2e19] hover:text-white'
                            }`}
                        >
                          <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Trust Badges / USPs */}
                <div className="grid grid-cols-4 gap-2 pt-4 md:pt-6 border-t border-[#eef2e9] mt-2">
                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l3 3.5v5.5a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h5z" />
                      <circle cx="6" cy="18" r="2" strokeWidth={1.5} />
                      <circle cx="18" cy="18" r="2" strokeWidth={1.5} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v6m4-6v6" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">Free shipping<br/><span className="lowercase">above</span> ₹1499</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 16.5l1.5 1.5 3-3" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">Secure<br/>Payments</span>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 4a2 2 0 110 4 2 2 0 010-4zm0 12c-2.67 0-8-1.34-8-4v-1.55c2.19-2 5.56-2.45 8-2.45s5.81.45 8 2.45V14c0 2.66-5.33 4-8 4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13c0-2 3-5 3-5s3 3 3 5" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">Farmers<br/>Empowerment</span>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-10 h-10 md:w-12 md:h-12 mb-2 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">COD<br/>available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accordion Info Full Width Section */}
        <section className="py-8 md:py-12 bg-[#fdfcf5] relative z-10 w-full overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-white/80 p-8 rounded-2xl shadow-sm border border-[#eef2e9]">
              {/* Item 1: DESCRIPTION */}
              <div className="border-b border-[#eef2e9]">
                <button
                  onClick={() => setOpenInfoTab(openInfoTab === 'description' ? null : 'description')}
                  className="w-full py-5 flex flex-row items-center justify-between focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-bold text-[#2f4f2f] uppercase tracking-widest group-hover:text-[#4b2e19] transition-colors">Description</span>
                  <span className="text-[#2f4f2f] text-2xl font-light leading-none group-hover:text-[#4b2e19] transition-colors">{openInfoTab === 'description' ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openInfoTab === 'description' ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm md:text-base text-[#2D2D2D]/80 leading-relaxed">
                    {product.Description}
                  </p>
                </div>
              </div>

              {/* Item 2: INGREDIENTS */}
              <div className="border-b border-[#eef2e9]">
                <button
                  onClick={() => setOpenInfoTab(openInfoTab === 'ingredients' ? null : 'ingredients')}
                  className="w-full py-5 flex flex-row items-center justify-between focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-bold text-[#2f4f2f] uppercase tracking-widest group-hover:text-[#4b2e19] transition-colors">Ingredients</span>
                  <span className="text-[#2f4f2f] text-2xl font-light leading-none group-hover:text-[#4b2e19] transition-colors">{openInfoTab === 'ingredients' ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openInfoTab === 'ingredients' ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm md:text-base text-[#2D2D2D]/80 leading-relaxed">
                    {product.Type === "Ghee" ? "100% Pure A2 Cow Milk Fat." : "100% Pure Raw Honey."}
                  </p>
                </div>
              </div>

              {/* Item 3: BENEFITS */}
              <div className="border-b border-[#eef2e9]">
                <button
                  onClick={() => setOpenInfoTab(openInfoTab === 'benefits' ? null : 'benefits')}
                  className="w-full py-5 flex flex-row items-center justify-between focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-bold text-[#2f4f2f] uppercase tracking-widest group-hover:text-[#4b2e19] transition-colors">Benefits</span>
                  <span className="text-[#2f4f2f] text-2xl font-light leading-none group-hover:text-[#4b2e19] transition-colors">{openInfoTab === 'benefits' ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openInfoTab === 'benefits' ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm md:text-base text-[#2D2D2D]/80 leading-relaxed">
                    {product.Type === "Ghee" 
                      ? "Aids digestion, boosts immunity, reduces inflammation, and promotes overall well-being with essential fatty acids."
                      : "Rich in antioxidants, soothes sore throats, acts as a natural energy booster, and supports gut health."}
                  </p>
                </div>
              </div>

              {/* Item 4: STORAGE INFO */}
              <div className="border-b border-[#eef2e9]">
                <button
                  onClick={() => setOpenInfoTab(openInfoTab === 'storage' ? null : 'storage')}
                  className="w-full py-5 flex flex-row items-center justify-between focus:outline-none group"
                >
                  <span className="text-sm md:text-base font-bold text-[#2f4f2f] uppercase tracking-widest group-hover:text-[#4b2e19] transition-colors">Storage Info</span>
                  <span className="text-[#2f4f2f] text-2xl font-light leading-none group-hover:text-[#4b2e19] transition-colors">{openInfoTab === 'storage' ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openInfoTab === 'storage' ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm md:text-base text-[#2D2D2D]/80 leading-relaxed">
                    {product.Type === "Ghee" 
                      ? "Store in a cool, dry place away from direct sunlight. Do not refrigerate. Always use a clean and dry spoon."
                      : "Store at room temperature in a dry place. Do not refrigerate. Crystallization is natural; place jar in warm water to reliquefy."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infographics Section: Quality Checks & Comparison */}
        {product.Type === 'Ghee' && (
          <section className="py-12 md:py-16 bg-white border-y border-[#eef2e9] mt-4 shadow-sm relative z-10">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#4b2e19] mb-4">Why Yuga Farms Ghee?</h2>
                <div className="w-24 h-1 bg-[#f5d26a] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Custom Quality Check Image/Card */}
                <div className="bg-[#2f4f2f] rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-center transform transition-transform duration-500 hover:scale-[1.01]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-2">70+ Quality Checks.</h3>
                  <h3 className="text-4xl md:text-5xl font-bold text-[#f5d26a] mb-10">0% Compromise.</h3>
                  
                  <div className="flex flex-col gap-5 relative z-10">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#f5d26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl mb-0.5 text-[#fdf7f2]">Heavy Metal Free</h4>
                        <p className="text-white/70 text-sm">Rigorously lab tested for absolute purity.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#f5d26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl mb-0.5 text-[#fdf7f2]">FDA Compliant Facility</h4>
                        <p className="text-white/70 text-sm">Adhering to the highest global safety standards.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#f5d26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl mb-0.5 text-[#fdf7f2]">Hormone & Antibiotic Free</h4>
                        <p className="text-white/70 text-sm">Sourced only from free-grazing healthy cows.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Card */}
                <div className="bg-[#fdf7f2] rounded-3xl p-8 md:p-10 border border-[#eef2e9] shadow-inner flex flex-col justify-center transform transition-transform duration-500 hover:scale-[1.01]">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-10 text-center">Yuga Farms vs Ordinary Ghee</h3>
                  
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Single-origin A2 milk</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Mixed-breed milk</div>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Free-grazing cows</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Grain-fed cows</div>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Traditional Bilona process</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Factory mass-produced</div>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Made from Curd (Makhan)</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Made directly from cream</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Rich, sweet-caramel aroma</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Pale, bland taste</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {product && (
          <section className="py-12 md:py-16 bg-[#fdf7f2] border-t border-[#eef2e9] relative z-10">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#4b2e19] mb-4">Frequently Asked Questions</h2>
                <div className="w-24 h-1 bg-[#f5d26a] mx-auto rounded-full"></div>
                <p className="mt-4 text-[#2D2D2D]/70 max-w-2xl mx-auto">
                  Got questions about our {product.Type}? We've got answers to help you make the best choice for your health.
                </p>
              </div>

              <div className="space-y-4">
                {(product.Type === "Ghee" ? [
                  { question: "What is the Bilona method?", answer: "The Bilona method is a traditional, slow-churning process where milk is first curdled in clay pots, then the curd is hand-churned using a wooden blender (bilona) to extract makkhan (butter). This butter is then slowly heated on a wood-fire to produce pure, nutrient-rich ghee." },
                  { question: "Why is your ghee slightly yellow?", answer: "Our ghee is primarily made from A2 cow milk, which naturally contains beta-carotene from the cows' natural grazing diet. This gives it a beautiful, rich golden-yellow hue without any artificial coloring." },
                  { question: "Does this ghee contain lactose?", answer: "Because of our traditional culturing and churning process, the milk solids (lactose and casein) are separated and removed. Our ghee is mostly free of lactose, making it highly suitable for individuals with mild lactose sensitivities." },
                  { question: "What is the shelf life of Yuga Farms Ghee?", answer: "Pure unadulterated ghee has a naturally long shelf life. Ours can be stored at room temperature for up to 12 months. Ensure you use a dry spoon and keep the jar tightly closed away from direct moisture." }
                ] : [
                  { question: "Is your honey raw and unprocessed?", answer: "Yes! Our honey is 100% raw, cold-extracted, and unfiltered. It is never heated or pasteurized, ensuring that all the natural enzymes, pollen, and antioxidants are perfectly preserved." },
                  { question: "Why did my honey crystallize?", answer: "Crystallization is an entirely natural process and a sign of pure, unheated honey. To bring it back to a liquid state, simply place the glass jar in a warm (not boiling) water bath and stir gently." },
                  { question: "How is your honey sourced?", answer: "Our honey is sustainably sourced directly from local bee farmers and deep forests. We ensure ethical practices that support bee populations and pristine natural environments without using sugar-feeding." },
                  { question: "Does honey expire?", answer: "Pure honey never truly expires. It is naturally antibacterial and can last indefinitely if stored properly in a tightly sealed glass container at room temperature away from direct sunlight." }
                ]).map((faq, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-2xl border transition-colors duration-300 overflow-hidden ${openFaqIndex === index ? 'border-[#f5d26a] shadow-md' : 'border-[#eef2e9] shadow-sm hover:border-[#4b2e19]/30'}`}
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    >
                      <span className="font-bold text-[#4b2e19] text-base md:text-lg pr-4">{faq.question}</span>
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-[#f5d26a] flex items-center justify-center text-[#f5d26a] transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 bg-[#f5d26a] text-white' : 'bg-white'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </span>
                    </button>
                    <div 
                      className={`px-6 transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                    >
                      <p className="text-[#2D2D2D]/80 leading-relaxed text-sm md:text-base border-t border-[#eef2e9] pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Products */}
        <section className="py-8 bg-[#eef2e9]">
          <div className="container mx-auto px-4 text-center">
            <Link
              href={`/${product.Type.toLowerCase()}`}
              className="inline-flex items-center gap-2 bg-[#4b2e19] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {product.Type} Collection
            </Link>
          </div>
        </section>

        {/* Fixed Bottom Bar - Mobile Only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#4b2e19]/20 shadow-2xl z-50">
          <div className="container mx-auto px-4 py-3">
            {/* Price Info */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#4b2e19]">₹{currentPrice}</span>
                  {originalPrice > currentPrice && (
                    <span className="text-lg text-[#2D2D2D]/60 line-through">₹{originalPrice}</span>
                  )}
                </div>
                {selectedVariant && (
                  <div className="text-xs text-[#2D2D2D]/70">
                    {formatUnit(selectedVariant.Weight, product.Type)}
                  </div>
                )}
              </div>
              {savings > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Save ₹{savings}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {itemInCart ? (
                <>
                  <div className="flex-1 bg-green-100 text-green-800 py-3 rounded-lg font-semibold text-center border-2 border-green-300 text-sm">
                    ✓ In Cart ({cartQuantity})
                  </div>
                  <Link
                    href="/cart"
                    className="flex items-center justify-center px-4 py-3 border-2 border-[#4b2e19] text-[#4b2e19] rounded-lg font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="flex-1 bg-[#4b2e19] text-white py-3 rounded-lg font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    onClick={handleAddToCart}
                    disabled={cartLoading || !selectedVariant}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    className="flex-1 bg-white border-2 border-[#4b2e19] text-[#4b2e19] py-3 rounded-lg font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    onClick={handleBuyNow}
                    disabled={cartLoading || !selectedVariant}
                  >
                    {cartLoading ? 'Processing...' : 'Buy Now'}
                  </button>
                  <button
                    onClick={toggleLike}
                    className={`flex items-center justify-center px-4 py-3 border-2 border-[#4b2e19] rounded-lg font-semibold transition-colors duration-300 ${isLiked
                        ? 'bg-[#4b2e19] text-white'
                        : 'text-[#4b2e19] hover:bg-[#4b2e19] hover:text-white'
                      }`}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Spacer for fixed bottom bar on mobile */}
        <div className="md:hidden h-32"></div>
      </main>
      <Footer />
    </>
  );
}
