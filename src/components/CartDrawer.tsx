'use client'
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import CouponApplyBlock from "@/components/CouponApplyBlock";
import { buildEventProducts, trackCustomerEvent } from "@/lib/customerEvents";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    updateQuantity,
    removeFromCart,
    showCheckoutOTP,
    discount,
  } = useCart();
  const { user, jwt } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isOpen || isLoading || items.length === 0) return;
    void trackCustomerEvent("cart", {
      jwt,
      payload: {
        source: "drawer",
        itemCount: totalItems,
        valueInr: totalPrice,
        products: buildEventProducts(items),
      },
    });
  }, [isOpen, isLoading, items, jwt, totalItems, totalPrice]);

  // Helper functions for unit conversion
  const formatVolume = (ml: number): string => {
    if (ml >= 1000) {
      const liters = ml / 1000;
      return liters % 1 === 0 ? `${liters} L` : `${liters.toFixed(1)} L`;
    }
    return `${ml} ml`;
  };

  const formatWeight = (grams: number): string => {
    if (grams >= 1000) {
      const kg = grams / 1000;
      return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
    }
    return `${grams} gram`;
  };

  // Determine product type from title
  const getProductType = (title: string): "Ghee" | "Honey" => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('ghee')) return 'Ghee';
    if (titleLower.includes('honey')) return 'Honey';
    // Default to Honey if unclear (most products are Honey)
    return 'Honey';
  };

  // Format weight based on product type
  const formatProductWeight = (weight: number, title: string): string => {
    const productType = getProductType(title);
    if (productType === 'Ghee') {
      return formatVolume(weight);
    } else {
      return formatWeight(weight);
    }
  };

  const handleQuantityChange = async (productId: number, variantId: number, newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      setIsUpdating(true);
      await updateQuantity(productId, variantId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: number, variantId: number) => {
    try {
      setIsUpdating(true);
      await removeFromCart(productId, variantId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const tax = 0;
  const finalTotal = Math.max(0, totalPrice + tax - discount);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed z-[101] bg-white transition-transform duration-300 ease-in-out shadow-2xl flex min-h-0 flex-col ${
          // Mobile: bottom sheet
          'w-full h-[92dvh] max-h-[92dvh] bottom-0 rounded-t-2xl md:rounded-none ' +
          // Desktop: pin top+bottom so the panel is always full viewport height (no gap underneath)
          'md:w-96 md:right-0 md:top-0 md:bottom-0 md:h-auto md:max-h-none ' +
          // Transform states
          (isOpen
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-x-full')
          }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-3 py-2.5 md:p-6 border-b border-[#4b2e19]/10">
          <h2 className="text-lg md:text-2xl font-bold text-[#4b2e19]">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-[#f5d26a]/10 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-[#4b2e19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content — coupon scrolls with items so footer stays short on phone */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
                <p className="text-[#4b2e19]">Loading...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-[#4b2e19] mb-2">Your Cart is Empty</h3>
              <p className="text-[#2D2D2D]/70 mb-6">Start adding items to your cart!</p>
              <button
                onClick={onClose}
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2f4f2f] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="px-3 pt-2 pb-3 md:p-6 space-y-2 md:space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-[#fdf7f2] rounded-lg md:rounded-xl border border-[#4b2e19]/10 p-2.5 md:p-4"
                >
                  <div className="flex gap-2.5 md:gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productTitle}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">🛒</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs md:text-base font-bold text-[#4b2e19] mb-0.5 md:mb-1 line-clamp-2 leading-snug">
                        {item.productTitle}
                      </h3>
                      <p className="text-[10px] md:text-xs text-[#2D2D2D]/70 mb-1.5 md:mb-2">
                        Size: {formatProductWeight(item.weight, item.productTitle)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                            disabled={isUpdating}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-[#4b2e19] text-[#4b2e19] flex items-center justify-center hover:bg-[#4b2e19] hover:text-white transition-colors disabled:opacity-50 text-xs md:text-sm"
                          >
                            -
                          </button>
                          <span className="w-6 md:w-8 text-center font-semibold text-[#4b2e19] text-xs md:text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                            disabled={isUpdating}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-[#4b2e19] text-[#4b2e19] flex items-center justify-center hover:bg-[#4b2e19] hover:text-white transition-colors disabled:opacity-50 text-xs md:text-sm"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs md:text-sm font-bold text-[#4b2e19]">₹{item.price * item.quantity}</p>
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 mt-0.5 md:mt-1"
                          >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <CouponApplyBlock variant="drawer" className="pt-1 border-t border-[#4b2e19]/10 mt-1" />
            </div>
          )}
        </div>

        {/* Footer: totals + actions only (coupon scrolls above) */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[#4b2e19]/10 bg-white px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:p-6 md:pb-6 space-y-2 md:space-y-4">
            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-[#2D2D2D]/70">Items ({totalItems})</span>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs md:text-sm text-green-600">
                  <span className="text-[#2D2D2D]/70">Discount</span>
                  <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="hidden md:flex justify-between text-sm">
                <span className="text-[#2D2D2D]/70">Shipping</span>
                <span className="font-semibold text-green-600">₹0</span>
              </div>
              <div className="hidden md:flex justify-between text-sm">
                <span className="text-[#2D2D2D]/70">Tax</span>
                <span className="font-semibold">₹{tax}</span>
              </div>
              <p className="md:hidden text-[10px] text-[#2D2D2D]/60">Incl. shipping &amp; tax</p>
              <div className="border-t border-[#4b2e19]/10 pt-1.5 md:pt-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#4b2e19] text-sm md:text-base">Total</span>
                  <span className="font-bold text-[#4b2e19] text-base md:text-lg">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {user ? (
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-[#4b2e19] text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-[#2f4f2f] transition-colors text-center"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <button
                onClick={() => {
                  showCheckoutOTP();
                }}
                className="w-full bg-[#4b2e19] text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-[#2f4f2f] transition-colors text-center"
              >
                Proceed to Checkout
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full text-[#4b2e19] hover:text-[#2f4f2f] transition-colors text-xs md:text-sm font-medium py-0.5"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

