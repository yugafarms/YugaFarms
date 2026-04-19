import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for shopping on YugaFarms — orders, payments, shipping, and use of our website for buying ghee and honey online in India.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
