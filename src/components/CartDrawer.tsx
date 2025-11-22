'use client'
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, isLoading, updateQuantity, removeFromCart, clearCart, showCheckoutOTP } = useCart();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        setIsUpdating(true);
        await clearCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const tax = Math.round(totalPrice * 0.18);
  const finalTotal = totalPrice + tax;

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
        className={`fixed z-[101] bg-white transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          // Mobile: bottom drawer
          'w-full h-[85vh] bottom-0 rounded-t-3xl md:rounded-none ' +
          // Desktop: right sidebar
          'md:w-96 md:right-0 md:top-0 md:h-full ' +
          // Transform states
          (isOpen
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-x-full')
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#4b2e19]/10">
          <h2 className="text-2xl font-bold text-[#4b2e19]">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f5d26a]/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[#4b2e19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
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
            <div className="p-4 md:p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-[#fdf7f2] rounded-xl border border-[#4b2e19]/10 p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
                      <h3 className="text-sm md:text-base font-bold text-[#4b2e19] mb-1 line-clamp-2">
                        {item.productTitle}
                      </h3>
                      <p className="text-xs text-[#2D2D2D]/70 mb-2">Size: {item.weight}g</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                            disabled={isUpdating}
                            className="w-7 h-7 rounded-full border-2 border-[#4b2e19] text-[#4b2e19] flex items-center justify-center hover:bg-[#4b2e19] hover:text-white transition-colors disabled:opacity-50 text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-[#4b2e19] text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                            disabled={isUpdating}
                            className="w-7 h-7 rounded-full border-2 border-[#4b2e19] text-[#4b2e19] flex items-center justify-center hover:bg-[#4b2e19] hover:text-white transition-colors disabled:opacity-50 text-sm"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#4b2e19]">₹{item.price * item.quantity}</p>
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 mt-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#4b2e19]/10 bg-white p-4 md:p-6 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#2D2D2D]/70">Items ({totalItems})</span>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2D2D2D]/70">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2D2D2D]/70">Tax</span>
                <span className="font-semibold">₹{tax}</span>
              </div>
              <div className="border-t border-[#4b2e19]/10 pt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-[#4b2e19]">Total</span>
                  <span className="font-bold text-[#4b2e19]">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            {user ? (
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors text-center"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <button
                onClick={() => {
                  showCheckoutOTP();
                }}
                className="w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors text-center"
              >
                Proceed to Checkout
              </button>
            )}

            {/* Clear Cart */}
            <button
              onClick={handleClearCart}
              disabled={isUpdating}
              className="w-full text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

