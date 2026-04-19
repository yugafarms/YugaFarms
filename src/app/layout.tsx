import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CartDrawerWrapper from "@/components/CartDrawerWrapper";
import MetaPixel from "@/components/MetaPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import TopOfferStrip from "@/components/TopOfferStrip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.yugafarms.com"),
  title: {
    default: "YugaFarms — Pure A2 Ghee & Honey Online India",
    template: "%s | YugaFarms",
  },
  description:
    "Buy A2 ghee online in India — bilona Sahiwal cow ghee, buffalo ghee & raw multifloral honey. Lab-tested, farm-fresh. Shop YugaFarms.",
  openGraph: {
    title: "YugaFarms — Pure A2 Ghee & Honey Online",
    description:
      "Buy A2 bilona ghee and raw honey online in India. Traditional method, lab-tested purity. Fast delivery from YugaFarms.",
    url: "https://www.yugafarms.com",
    siteName: "YugaFarms",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "YugaFarms Logo"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YugaFarms — Buy A2 Ghee & Honey Online India",
    description:
      "Bilona A2 cow ghee and raw honey — lab-tested, farm-fresh. Shop YugaFarms online.",
    images: ["/logo.png"],
    creator: "@yugafarms",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopOfferStrip />
        <AuthProvider>
          <GoogleAnalytics />
          <MetaPixel />
          <CartProvider>
            {/* <TopBar /> */}
            <main className="pt-24">{children}</main>
            {/* <Footer /> */}
            <CartDrawerWrapper />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
