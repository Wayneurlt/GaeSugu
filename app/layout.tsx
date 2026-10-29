import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/blocks";

const fontsHref =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@800&family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap";

export const metadata: Metadata = {
  title: "Gae Sugu",
  description:
    "Gae is a broken piece of a pot. We gather the scattered pieces of African knowledge, starting in Kenya, into a living digital archive rooted in nature.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
