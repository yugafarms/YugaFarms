/**
 * Meta Pixel manual advanced matching (fbq init third argument).
 * @see https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching
 */

export const YGF_CHECKOUT_CONTACT_KEY = "ygf_checkout_contact";
export const YGF_SIGNUP_DRAFT_KEY = "ygf_signup_draft";
export const YGF_PIXEL_CONTACT_EVENT = "ygf-pixel-contact-changed";

export type CheckoutContactPayload = {
  fullName?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type SignupDraftPayload = {
  email?: string;
  username?: string;
};

export type AuthUserLike = {
  id?: number;
  username?: string;
  email?: string;
};

function normalizeEm(email: string | undefined): string | undefined {
  if (!email?.trim()) return undefined;
  return email.trim().toLowerCase();
}

/** Split display name into Meta fn / ln (lowercase letters per Meta). */
function splitFullName(raw: string | undefined): { fn?: string; ln?: string } {
  const t = raw?.trim();
  if (!t) return {};
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  const fn = parts[0].toLowerCase();
  const ln = parts.length > 1 ? parts.slice(1).join(" ").toLowerCase() : undefined;
  return ln ? { fn, ln } : { fn };
}

/**
 * Meta: digits only, include country code and area code (e.g. 16505551234).
 * India: 10-digit mobile → prefix 91.
 */
export function normalizePhoneForMeta(phone: string | undefined): string | undefined {
  if (!phone?.trim()) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  digits = digits.replace(/^0+/, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) digits = `91${digits}`;
  return digits;
}

/** City: lowercase, spaces removed (Meta ct). */
function normalizeCt(city: string | undefined): string | undefined {
  if (!city?.trim()) return undefined;
  return city.trim().toLowerCase().replace(/\s+/g, "");
}

/** State: lowercase two-letter code only (skip longer names to avoid bad matches). */
function normalizeSt(state: string | undefined): string | undefined {
  if (!state?.trim()) return undefined;
  const s = state.trim().toLowerCase().replace(/\s+/g, "");
  if (s.length === 2) return s;
  return undefined;
}

function normalizeZp(pincode: string | undefined): string | undefined {
  if (!pincode?.trim()) return undefined;
  return pincode.trim().toLowerCase();
}

export function readCheckoutContact(): CheckoutContactPayload | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(YGF_CHECKOUT_CONTACT_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return null;
    return j as CheckoutContactPayload;
  } catch {
    return null;
  }
}

export function readSignupDraft(): SignupDraftPayload | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(YGF_SIGNUP_DRAFT_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return null;
    return j as SignupDraftPayload;
  } catch {
    return null;
  }
}

/**
 * Builds the third argument for fbq('init', pixelId, params).
 * Values are normalized per Meta (lowercase where required); the pixel hashes as needed.
 */
export function buildMetaAdvancedMatchingParams(
  user: AuthUserLike | null | undefined,
  checkout: CheckoutContactPayload | null | undefined,
  signupDraft: SignupDraftPayload | null | undefined
): Record<string, string> {
  const out: Record<string, string> = {};

  const em = normalizeEm(user?.email) ?? normalizeEm(signupDraft?.email);
  if (em) out.em = em;

  const nameFromCheckout = splitFullName(checkout?.fullName);
  const nameFromUser = splitFullName(user?.username);
  const nameFromSignup = splitFullName(signupDraft?.username);

  const fn = nameFromCheckout.fn ?? nameFromUser.fn ?? nameFromSignup.fn;
  const ln = nameFromCheckout.ln ?? nameFromUser.ln ?? nameFromSignup.ln;
  if (fn) out.fn = fn;
  if (ln) out.ln = ln;

  const ph = normalizePhoneForMeta(checkout?.phone);
  if (ph) out.ph = ph;

  const ct = normalizeCt(checkout?.city);
  if (ct) out.ct = ct;

  const st = normalizeSt(checkout?.state);
  if (st) out.st = st;

  const zp = normalizeZp(checkout?.pincode);
  if (zp) out.zp = zp;

  if (checkout?.pincode && /^\d{6}$/.test(checkout.pincode.trim())) {
    out.country = "in";
  }

  if (user?.id != null) {
    out.external_id = String(user.id).toLowerCase();
  }

  return out;
}

export function dispatchPixelContactUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(YGF_PIXEL_CONTACT_EVENT));
}
