import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Gae Sugu",
  robots: { index: false, follow: false },
};

// Served with the site itself, so the admin never waits on (or breaks because of) a font request.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-admin" });

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`admin ${inter.variable}`}>{children}</div>;
}
