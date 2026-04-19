import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/checkout",
        "/cart",
        "/login",
        "/signup",
        "/profile",
        "/orders",
        "/order-success/",
        "/forgot-password",
        "/reset-password",
        "/debug-products",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
