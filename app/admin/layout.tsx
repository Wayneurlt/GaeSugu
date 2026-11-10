import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Gae Sugu",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      {/* React places this stylesheet in the page head. */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" precedence="default" />
      {children}
    </div>
  );
}
