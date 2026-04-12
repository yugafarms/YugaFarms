"use client";

import { useId } from "react";
import { useCart } from "@/app/context/CartContext";

type CouponApplyBlockProps = {
  variant?: "drawer" | "page" | "checkout";
  className?: string;
};

export default function CouponApplyBlock({
  variant = "checkout",
  className = "",
}: CouponApplyBlockProps) {
  const uid = useId();
  const {
    couponCode,
    setCouponCode,
    couponError,
    couponSuccess,
    discount,
    appliedCoupon,
    verifyCoupon,
    removeCoupon,
    couponVerifying,
    totalPrice,
  } = useCart();

  const isDrawer = variant === "drawer";
  const inputId = `${uid}-coupon`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-[#4b2e19] mb-2">
        Have a coupon?
      </label>
      {!isDrawer && (
        <p className="text-xs text-[#2D2D2D]/70 mb-3">
          {variant === "checkout"
            ? "Enter your code below or tap a suggested coupon."
            : "Apply a code — it stays saved for checkout."}
        </p>
      )}
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="e.g. NEW5"
          disabled={couponVerifying}
          className="flex-1 border border-[#4b2e19]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => verifyCoupon()}
          disabled={couponVerifying || totalPrice <= 0}
          className="bg-[#4b2e19] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2f4f2f] transition-colors disabled:opacity-50 shrink-0"
        >
          {couponVerifying ? "…" : "Apply"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 items-center">
        <button
          type="button"
          onClick={() => verifyCoupon("NEW5")}
          disabled={couponVerifying || totalPrice <= 0}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border border-[#4b2e19]/20 bg-[#f5d26a]/20 text-[#4b2e19] hover:bg-[#f5d26a]/35 transition-colors disabled:opacity-50 ${
            isDrawer ? "" : ""
          }`}
        >
          Use NEW5
        </button>
        {appliedCoupon && discount > 0 && (
          <button
            type="button"
            onClick={removeCoupon}
            className="text-xs font-medium text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
      {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
      {couponSuccess && <p className="text-green-600 text-xs mt-2">{couponSuccess}</p>}
    </div>
  );
}
