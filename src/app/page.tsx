import HomePageClient from "./HomePageClient";
import {
  getBannerMedia,
  getClients,
  getTopPicksProducts,
} from "@/lib/strapiPublic";

export default async function Home() {
  const [bannerItems, topProducts, clients] = await Promise.all([
    getBannerMedia(),
    getTopPicksProducts(),
    getClients(),
  ]);

  return (
    <HomePageClient
      bannerItems={bannerItems}
      topProducts={topProducts}
      clients={clients}
    />
  );
}
