/** Shared coupon discount math (matches checkout / backend order controller). */

export type AppliedCoupon = {
  id: number;
  Code: string;
  Expiry: string;
  Count: number;
  Percentage: boolean;
  Value: number;
};

export function computeDiscountForSubtotal(
  coupon: AppliedCoupon | null,
  subtotal: number
): number {
  if (!coupon || subtotal <= 0) return 0;
  if (new Date() > new Date(coupon.Expiry)) return 0;
  if (coupon.Count <= 0) return 0;

  const couponValue = Number(coupon.Value);
  let calculated = coupon.Percentage
    ? (subtotal * couponValue) / 100
    : couponValue;

  return Math.min(calculated, subtotal);
}
