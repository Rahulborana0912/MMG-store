import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { LanguageProvider } from "@/context/LanguageContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MMG — Mahadev Marble and Granite Pvt. Ltd. | Premium Indian Natural Stone",
  description: "Direct processors and suppliers of Makrana white marble, Italian marble, premium Indian granites, and natural stone tiles. Showroom in Raghunathpura, Kelwa, Rajasthan.",
  keywords: [
    "Mahadev Marble and Granite",
    "MMG",
    "Indian Marble Slabs",
    "Makrana White Marble",
    "Black Galaxy Granite",
    "Natural Stone Tiles India",
    "Udaipur Marble Supplier",
    "Granite Slabs Udaipur",
  ],
  verification: {
    google: "h7_HCqIizqlqxXdJwK6DUDgiC262J_z9WygDTmho5do",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-stone-50 text-charcoal-900 selection:bg-stone-300 selection:text-charcoal-950">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </LanguageProvider>
      </body>
    </html>
  );
}
