import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawerWrapper from "@/components/cart/CartDrawerWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hello Food | Pizza, Burgers & More in Pilibhit",
  description:
    "Hello Food - Best pizza, burgers, pasta, shakes and more in Pilibhit, Uttar Pradesh. Dine-in, drive-through & delivery. Order online now!",
  keywords: [
    "Hello Food",
    "restaurant Pilibhit",
    "pizza Pilibhit",
    "burgers Pilibhit",
    "food delivery Pilibhit",
    "best food Pilibhit",
  ],
  openGraph: {
    title: "Hello Food | Pilibhit",
    description:
      "Best pizza, burgers, pasta, shakes and more. Order online!",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawerWrapper />
      </body>
    </html>
  );
}
