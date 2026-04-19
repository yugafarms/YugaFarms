import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "YugaFarms privacy policy — how we collect, use, and protect your personal data when you shop A2 ghee and honey online.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
