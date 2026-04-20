import { cache } from "react";
import { getBlogBySlug } from "@/lib/strapiPublic";

/** One Strapi round-trip per request for metadata + page body. */
export const loadBlogBySlug = cache((slug: string) => getBlogBySlug(slug));
