import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Single-family system — the "Altitude" theme is set entirely in one geometric
// sans, differentiated by weight and tracking rather than by typeface.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eavesdrop — We listen where your buyers talk",
  description:
    "Multi-source buyer-intent lead generation. Find people across Reddit, X, and Hacker News who are actively expressing buying intent for a product like yours — with scoring that gets smarter the more you use it.",
  openGraph: {
    title: "Eavesdrop — We listen where your buyers talk",
    description:
      "Multi-source buyer-intent lead generation with a self-improving AI scoring engine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
