import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type Offer = {
  id: number;
  Text: string;
  Url: string | null;
};

const FALLBACK_OFFERS = [
  "Lower Prices with GST 2.0",
  "Navratri Special Flat 15% OFF",
  "Free Hamper on Orders INR 1999+",
  "Free Shipping on INR 699+ orders",
  "Pure Ghee - Lab Tested",
];

async function getOffers(): Promise<Offer[]> {
  try {
    const res = await fetch(`${BACKEND}/api/nav-offers`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: Offer[] };
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function TopOfferStrip() {
  const offers = await getOffers();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#4b2e19] text-[#f5d26a] text-sm">
      <div className="relative overflow-hidden h-10 flex items-center">
        <div className="marquee-track will-change-transform font-semibold">
          <div className="marquee-group">
            {offers.length > 0
              ? offers.map((offer) => (
                  <span key={`offer-1-${offer.id}`} className="mx-6">
                    {offer.Url ? (
                      <Link href={offer.Url} className="hover:underline">
                        {offer.Text}
                      </Link>
                    ) : (
                      offer.Text
                    )}
                  </span>
                ))
              : FALLBACK_OFFERS.map((text, idx) => (
                  <span key={`offer-fallback-1-${idx}`} className="mx-6">
                    {text}
                  </span>
                ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {offers.length > 0
              ? offers.map((offer) => (
                  <span key={`offer-2-${offer.id}`} className="mx-6">
                    {offer.Url ? (
                      <Link href={offer.Url} className="hover:underline">
                        {offer.Text}
                      </Link>
                    ) : (
                      offer.Text
                    )}
                  </span>
                ))
              : FALLBACK_OFFERS.map((text, idx) => (
                  <span key={`offer-fallback-2-${idx}`} className="mx-6">
                    {text}
                  </span>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

