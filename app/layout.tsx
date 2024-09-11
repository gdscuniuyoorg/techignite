import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localfont from "next/font/local";
import "./globals.css";
import Footer from "@/components/sections/Footer";
import LumaCheckoutScript from "@/components/molecules/Luma";

const inter = Inter({ subsets: ["latin"] });

const productSans = localfont({
  src: [
    {
      path: "../public/custom-font/product-sans/Product-Sans-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/custom-font/product-sans/Product Sans Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-product-sans",
});

export const metadata: Metadata = {
  title: "Tech Ignite",
  description: "Built by GDSC Uniuyo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${productSans.variable} bg-[#f5f9fe]`}
      >
        {children}
        <Footer />
      </body>

      <LumaCheckoutScript />
    </html>
  );
}
