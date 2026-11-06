import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "Prestum Turnos", statusBarStyle: "black-translucent" },
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  // Cuando tengas Google Search Console, pegá el código acá:
  // verification: { google: "XXXX" },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {/* Header/Footer los pone cada producto (cada software tiene su propia marca). */}
        {children}
      </body>
    </html>
  );
}
