const DEFAULT_BACKEND = "http://localhost:1337";

/** Prefer BACKEND_URL on the server (e.g. Vercel → Strapi) so SSR/crawlers always resolve the API. */
export function getBackendUrl(): string {
  if (typeof window === "undefined" && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  return process.env.NEXT_PUBLIC_BACKEND || DEFAULT_BACKEND;
}

const REVALIDATE_SECONDS = 300;

async function fetchStrapiJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type ProductVariant = {
  id: number;
  Price: number;
  Discount: number;
  Weight: number;
  Stock: number;
};

export type ProductTag = {
  id: number;
  Value: string;
};

export type ProductImage = {
  id: number;
  url: string;
  alternativeText?: string;
};

export type Product = {
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

export type BannerMedia = {
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

export type ClientImage = {
  id: number;
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
  };
};

export type Client = {
  id: number;
  Name: string;
  Review: string;
  Rating: number;
  Designation: string | null;
  Image: ClientImage | null;
};

export type BlogSection = {
  id: number;
  documentId: string;
  Title: string;
  sluge: string;
  Content: string;
  CoverImage: {
    id: number;
    url: string;
    alternativeText: string | null;
  } | null;
  publishedAt: string;
};

export async function getBannerMedia(): Promise<BannerMedia[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: { Banner?: BannerMedia[] } }>(
    `${backend}/api/banner?populate=*`
  );
  return data?.data?.Banner ?? [];
}

export async function getTopPicksProducts(): Promise<Product[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Product[] }>(
    `${backend}/api/products?filters[TopPicks][$eq]=true&populate=*&sort=NumberOfPurchase:desc`
  );
  return data?.data ?? [];
}

export async function getClients(): Promise<Client[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Client[] }>(`${backend}/api/clients?populate=*`);
  return data?.data ?? [];
}

export async function getProductsByType(type: "Ghee" | "Honey"): Promise<Product[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Product[] }>(
    `${backend}/api/products?filters[Type][$eq]=${type}&filters[TopPicks][$eq]=false&populate=*`
  );
  return data?.data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const backend = getBackendUrl();
  let data = await fetchStrapiJson<{ data?: Product }>(
    `${backend}/api/products/${id}?publicationState=live&populate=*`
  );
  if (!data?.data) {
    data = await fetchStrapiJson<{ data?: Product }>(
      `${backend}/api/products/${id}?populate=*`
    );
  }
  if (data?.data) return data.data;

  const list = await fetchStrapiJson<{ data?: Product[] }>(`${backend}/api/products?populate=*`);
  return list?.data?.find((p) => p.id.toString() === id) ?? null;
}

export async function getBlogSections(): Promise<BlogSection[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: BlogSection[] }>(
    `${backend}/api/blog-sections?populate=*&sort=publishedAt:desc`
  );
  return data?.data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<BlogSection | null> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: BlogSection[] }>(
    `${backend}/api/blog-sections?filters[sluge][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  const rows = data?.data;
  return rows && rows.length > 0 ? rows[0] : null;
}

export function stripHtmlToPlain(text: string, maxLen: number): string {
  const plain = text.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen)}…`;
}
