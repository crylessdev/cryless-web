import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryless Visuals | Ultimate Minecraft Fabric Mod Hub",
  description: "Advanced client-side Fabric mod for Minecraft optimization, Sakura UI themes, and total visual control. Discover our premium community space and exclusive merchandise.",
  verification: {
    google: "VLjrS53B5Tn651O5Z-Ivjja-IyczzSbrZ68zess_sn0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org structured data for SEO ranking
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cryless Visuals",
    "operatingSystem": "Windows 10, Windows 11",
    "applicationCategory": "GameApplication",
    "browserRequirements": "Requires Minecraft Fabric Loader",
    "softwareVersion": "1.21.11",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#08080c] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}