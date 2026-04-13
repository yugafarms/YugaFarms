/**
 * Google Analytics 4 (gtag) ecommerce helpers.
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-LB7PB2YL1E";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 recommended item shape */
export type GaItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export type CartLineForGa = {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  weight: number;
  productTitle: string;
};

export function lineToGaItem(line: CartLineForGa): GaItem {
  return {
    item_id: `${line.productId}_${line.variantId}`,
    item_name: line.productTitle,
    item_variant: String(line.weight),
    price: line.price,
    quantity: line.quantity,
  };
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

export function trackGaEvent(
  name: string,
  params?: Record<string, unknown>
) {
  if (!GA_MEASUREMENT_ID) return;
  gtag("event", name, params);
}

/** Call on SPA route changes when using send_page_view: false */
export function trackGaPageView(pathWithQuery: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: pathWithQuery,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}

export function setGaUserId(userId: string | null) {
  if (!GA_MEASUREMENT_ID) return;
  gtag("config", GA_MEASUREMENT_ID, {
    user_id: userId ?? undefined,
  });
}

function sumItemsValue(items: GaItem[]): number {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}

export function trackViewItem(item: GaItem, currency = "INR") {
  trackGaEvent("view_item", {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackAddToCart(item: GaItem, currency = "INR") {
  trackGaEvent("add_to_cart", {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackRemoveFromCart(item: GaItem, currency = "INR") {
  trackGaEvent("remove_from_cart", {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackViewCart(lines: CartLineForGa[], currency = "INR") {
  if (lines.length === 0) return;
  const items = lines.map(lineToGaItem);
  trackGaEvent("view_cart", {
    currency,
    value: sumItemsValue(items),
    items,
  });
}

export function trackBeginCheckout(
  lines: CartLineForGa[],
  value: number,
  currency = "INR",
  coupon?: string
) {
  if (lines.length === 0) return;
  const items = lines.map(lineToGaItem);
  trackGaEvent("begin_checkout", {
    currency,
    value,
    items,
    ...(coupon ? { coupon } : {}),
  });
}

export type PurchasePayload = {
  transactionId: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  coupon?: string;
  items: CartLineForGa[];
};

export function trackPurchase(payload: PurchasePayload) {
  const { transactionId, value, tax, shipping, currency = "INR", coupon, items: lines } = payload;
  if (lines.length === 0) return;
  const items = lines.map(lineToGaItem);
  trackGaEvent("purchase", {
    transaction_id: transactionId,
    value,
    currency,
    items,
    ...(tax != null ? { tax } : {}),
    ...(shipping != null ? { shipping } : {}),
    ...(coupon ? { coupon } : {}),
  });
}
