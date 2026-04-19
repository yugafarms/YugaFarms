import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Reports — Quality & Purity Tests",
  description:
    "View lab reports and quality tests for YugaFarms A2 ghee and honey — transparency you can verify. FSSAI-compliant, purity-focused.",
  alternates: { canonical: "/lab-reports" },
};

export default function LabReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
