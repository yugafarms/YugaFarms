import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import JsonLd from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo";
import {
  getBannerMedia,
  getClients,
  getTopPicksProducts,
} from "@/lib/strapiPublic";

export const metadata: Metadata = {
  title: "Buy Pure A2 Cow Ghee Online",
  description:
    "Buy A2 ghee online in India — Sahiwal cow bilona ghee, buffalo ghee & raw multifloral honey. Lab-tested purity, farm-fresh. Order from YugaFarms.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Buy Pure A2 Cow Ghee Online | YugaFarms",
    description:
      "Shop bilona A2 cow ghee and natural honey online. Trusted by families across India — YugaFarms.",
  },
};

export default async function Home() {
  const [bannerItems, topProducts, clients] = await Promise.all([
    getBannerMedia(),
    getTopPicksProducts(),
    getClients(),
  ]);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <HomePageClient
        bannerItems={bannerItems}
        topProducts={topProducts}
        clients={clients}
      />
    </>
  );
}
