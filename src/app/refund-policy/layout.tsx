import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description:
    "Refunds and returns policy for YugaFarms — how to request a return for ghee or honey orders and when refunds apply.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
