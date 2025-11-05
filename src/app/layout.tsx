import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YugaFarms - Pure & Natural Ghee | Rooted in Purity",
    template: "%s | YugaFarms",
  },
  description:
    "Experience the purest ghee made using traditional Bilona methods with YugaFarms. Rooted in Indian heritage, always natural.",
  openGraph: {
    title: "YugaFarms - Pure & Natural Ghee",
    description: "Discover YugaFarms Ghee, produced using time-honored traditions for natural wellness.",
    url: "https://yugafarms.com", // Replace with actual domain
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
    title: "YugaFarms - Pure & Natural Ghee",
    description: "Traditional Indian ghee crafted with purity for your family.",
    images: ["/logo.png"],
    creator: "@yugafarms", // Replace with actual/X handle if applicable
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
        <AuthProvider>
          <CartProvider>
            {/* <TopBar /> */}
            <main className="pt-24">{children}</main>
            {/* <Footer /> */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
