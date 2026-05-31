import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="cs" className="scroll-smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
