import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Marta & Jakub — 10. 10. 2026",
  description: "Pozvánka na svatbu Marty a Jakuba",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`scroll-smooth ${greatVibes.variable}`}>
      <body className="min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
