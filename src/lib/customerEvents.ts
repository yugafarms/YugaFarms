/**
 * Storefront → Strapi customer-events (one row per tab per event via sessionStorage).
 */

export type CustomerEventName = "cart" | "checkout";

const SESSION_KEYS: Record<CustomerEventName, string> = {
  cart: "ygf_ce_cart",
  checkout: "ygf_ce_checkout",
};

/**
 * Sends a single analytics row per browser tab until refresh/close (sessionStorage).
 * Optional JWT: backend verifies and links `user`; never trust client-supplied user id.
 */
export async function trackCustomerEvent(
  eventName: CustomerEventName,
  opts?: {
    path?: string;
    payload?: Record<string, unknown> | null;
    jwt?: string | null;
    /** When true, skip until `jwt` is set so Strapi can link the user (e.g. checkout after OTP). */
    requireAuth?: boolean;
  }
): Promise<void> {
  if (typeof window === "undefined") return;
  if (opts?.requireAuth && !opts.jwt) return;

  const storageKey = SESSION_KEYS[eventName];
  if (sessionStorage.getItem(storageKey)) return;
  sessionStorage.setItem(storageKey, "1");

  const backend = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";
  const now = new Date().toISOString();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const jwt = opts?.jwt;
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  try {
    const res = await fetch(`${backend}/api/customer-event/track`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          eventName,
          occurredAt: now,
          path: opts?.path ?? window.location.pathname,
          payload: opts?.payload ?? null,
        },
      }),
    });
    if (!res.ok) {
      sessionStorage.removeItem(storageKey);
    }
  } catch {
    sessionStorage.removeItem(storageKey);
  }
}
